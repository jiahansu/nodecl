/*
 * nodecl - An implementation of the JavaScript bindings for OpenCL.
 * https://github.com/jiahansu/nodecl
 *
 * Copyright (c) 2013-2013, Jia-Han Su (https://github.com/jiahansu)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Jia-Han Su nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY JIA-HAN SU AND CONTRIBUTORS ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE REGENTS AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


var log4js = require("log4js"),
        log = log4js.getLogger("example"), NodeCL = require("../lib/nodecl"), cl,
        fs = require("fs"), init, Type = NodeCL.Type, Signature = NodeCL.Signature;

cl = NodeCL.load(1.2);

var clamp = function(value, min, max) {
    if (value < min) {
        value = min;
    }

    if (value > max) {
        value = max;
    }

    return value;
};

var rgbToYuv = function(rgb) {
    var yuv = new Array(3), r = rgb[0], g = rgb[1], b = rgb[2];

    yuv[0] = clamp(Math.round(0.299 * r + 0.587 * g + 0.114 * b), 0, 255);
    yuv[1] = clamp(Math.round(-0.169 * r - 0.331 * g + 0.5 * b + 128), 0, 255);
    yuv[2] = clamp(Math.round(0.5 * r - 0.419 * g - 0.081 * b + 128), 0, 255);

    return yuv;
};


init = function(kernelCode) {

    var fastDeviceInfo = NodeCL.findMaxFlopsDevice(cl, cl.DEVICE_TYPE_CPU, true, null),
            contextProperties = NodeCL.newArray(Type.platformId, 3), context, commandQueue,
            pError = new NodeCL.NativeValue.int(), error, resultBuffer,
            memA, memY, memU, memV, program, pPtr = new NodeCL.newArray(Signature.pointer, 1),
            pSize = new NodeCL.newArray(Signature.size, 1), kernel, workSize = new NodeCL.newArray(Signature.size, 2),
            kernelCodeBuffer = new Buffer(kernelCode, "utf8"),
            imageSize = {width: 1920, height: 1080}, uvImageSize =
            {width: imageSize.width * 0.5, height: imageSize.height * 0.5}, imageFormat, imageDesc,
            invertMaxGlobalIdBuffer = NodeCL.newArray(Signature.float, 2),
            imageSizeBuffer = NodeCL.newArray(Signature.int, 2),
            originBuffer = NodeCL.newArray(Signature.size, 3),
            regionBuffer = NodeCL.newArray(Signature.size, 3);

    log.info("Using device: " + NodeCL.getDeviceInfoString(cl, fastDeviceInfo.deviceId, cl.DEVICE_NAME));
    /*Keep a, y, u, v as global member to prevent GC*/
    a = new Buffer(imageSize.width * imageSize.height * 4);

    y = new Buffer(imageSize.width * imageSize.height);
    u = new Buffer((uvImageSize.width) * (uvImageSize.height));
    v = new Buffer((uvImageSize.width) * (uvImageSize.height));
    
    a.fill(0);

    y.fill(0);
    u.fill(0);
    v.fill(0);

    contextProperties.set(0, cl.CONTEXT_PLATFORM);
    contextProperties.set(1, fastDeviceInfo.platformId);
    contextProperties.set(2, 0);
    context = cl.createContextFromType(NodeCL.byPointer(contextProperties), cl.DEVICE_TYPE_ALL,
            null, null, NodeCL.byPointer(pError));
    //log.info(context);
    NodeCL.checkError(pError);

    commandQueue = cl.createCommandQueue(context,
            fastDeviceInfo.deviceId, 0, NodeCL.byPointer(pError));

    NodeCL.checkError(pError);

    pPtr.set(0, kernelCodeBuffer);
    pSize.set(0, kernelCodeBuffer.length);
    program = cl.createProgramWithSource(context, 1,
            NodeCL.byPointer(pPtr), NodeCL.byPointer(pSize), NodeCL.byPointer(pError));
    NodeCL.checkError(pError);

    pPtr.set(0, fastDeviceInfo.deviceId);
    error = cl.buildProgram(program, 1, NodeCL.byPointer(pPtr), "-cl-mad-enable", null, null);

    if (error !== cl.SUCCESS) {
        var strBuffer, str;
        error = cl.getProgramBuildInfo(program, fastDeviceInfo.deviceId, cl.PROGRAM_BUILD_LOG,
                0, null, NodeCL.byPointer(pSize));

        NodeCL.checkError(error);

        strBuffer = new Buffer(pSize.get(0));
        //log.info(pSize.get(0));
        error = cl.getProgramBuildInfo(program, fastDeviceInfo.deviceId, cl.PROGRAM_BUILD_LOG,
                strBuffer.length, strBuffer, NodeCL.byPointer(pSize));
        NodeCL.checkError(error);

        str = NodeCL.toString(strBuffer);
        log.warn(str);

        throw new Error(str);
    }

    NodeCL.checkError(error);
    // Create the OpenCL kernel
    kernel = cl.createKernel(program, "rgbToYuv", NodeCL.byPointer(pError));
    NodeCL.checkError(pError);

    imageFormat = new NodeCL.Type.ImageFormat();
    imageFormat.imageChannelOrder = cl.RGBA;
    imageFormat.imageChannelDataType = cl.UNORM_INT8;


    imageDesc = new NodeCL.Type.ImageDesc();
    imageDesc.imageType = cl.MEM_OBJECT_IMAGE2D;
    imageDesc.imageWidth = imageSize.width;
    imageDesc.imageHeight = imageSize.height;
    imageDesc.imageDepth = 0;
    imageDesc.imageArraySize = 0;
    imageDesc.imageRowPitch = imageSize.width * 4;
    imageDesc.imageSlicePitch = 0;
    imageDesc.numMipLevels = 0;
    imageDesc.numSamples = 0;
    imageDesc.buffer = null;


    //log.info( imageFormat.imageChannelDataType);
    memA = cl.createImage(context, cl.MEM_READ_ONLY | cl.MEM_USE_HOST_PTR, NodeCL.byPointer(imageFormat),
            NodeCL.byPointer(imageDesc), a, NodeCL.byPointer(pError));
    //log.info( imageFormat.imageChannelDataType);
    NodeCL.checkError(pError);

    imageFormat.imageChannelOrder = cl.R;
    imageFormat.imageChannelDataType = cl.UNORM_INT8;

    imageDesc.imageType = cl.MEM_OBJECT_IMAGE2D;
    imageDesc.imageWidth = imageSize.width;
    imageDesc.imageHeight = imageSize.height;
    imageDesc.imageDepth = 0;
    imageDesc.imageArraySize = 0;
    imageDesc.imageRowPitch = imageSize.width;
    imageDesc.imageSlicePitch = 0;
    imageDesc.numMipLevels = 0;
    imageDesc.numSamples = 0;
    imageDesc.buffer = null;

    memY = cl.createImage(context, cl.MEM_USE_HOST_PTR, NodeCL.byPointer(imageFormat),
            NodeCL.byPointer(imageDesc), y, NodeCL.byPointer(pError));
    NodeCL.checkError(pError);

    imageFormat.imageChannelOrder = cl.R;
    imageFormat.imageChannelDataType = cl.UNORM_INT8;

    imageDesc.imageType = cl.MEM_OBJECT_IMAGE2D;
    imageDesc.imageWidth = uvImageSize.width;
    imageDesc.imageHeight = uvImageSize.height;
    imageDesc.imageDepth = 0;
    imageDesc.imageArraySize = 0;
    imageDesc.imageRowPitch = imageDesc.imageWidth;
    imageDesc.imageSlicePitch = 0;
    imageDesc.numMipLevels = 0;
    imageDesc.numSamples = 0;
    imageDesc.buffer = null;


    memU = cl.createImage(context, cl.MEM_USE_HOST_PTR, NodeCL.byPointer(imageFormat),
            NodeCL.byPointer(imageDesc), u, NodeCL.byPointer(pError));
    NodeCL.checkError(pError);

    memV = cl.createImage(context, cl.MEM_USE_HOST_PTR, NodeCL.byPointer(imageFormat),
            NodeCL.byPointer(imageDesc), v, NodeCL.byPointer(pError));
    NodeCL.checkError(pError);

    pPtr.set(0, memA);
    error = cl.setKernelArg(kernel, 0, NodeCL.sizeof(Type.mem), NodeCL.byPointer(pPtr));
    NodeCL.checkError(error);

    invertMaxGlobalIdBuffer.set(0, 1.0 / (imageSize.width - 1));
    invertMaxGlobalIdBuffer.set(1, 1.0 / (imageSize.height - 1));
    error = cl.setKernelArg(kernel, 1, NodeCL.sizeof(invertMaxGlobalIdBuffer),
            NodeCL.byPointer(invertMaxGlobalIdBuffer));
    NodeCL.checkError(error);

    pPtr.set(0, memY);
    error = cl.setKernelArg(kernel, 2, NodeCL.sizeof(Type.mem), NodeCL.byPointer(pPtr));
    NodeCL.checkError(error);

    pPtr.set(0, memU);
    error = cl.setKernelArg(kernel, 3, NodeCL.sizeof(Type.mem), NodeCL.byPointer(pPtr));
    NodeCL.checkError(error);

    pPtr.set(0, memV);
    error = cl.setKernelArg(kernel, 4, NodeCL.sizeof(Type.mem), NodeCL.byPointer(pPtr));
    NodeCL.checkError(error);

    imageSizeBuffer.set(0, imageSize.width - 1);
    imageSizeBuffer.set(1, imageSize.height - 1);
    error = cl.setKernelArg(kernel, 5, NodeCL.sizeof(imageSizeBuffer), NodeCL.byPointer(imageSizeBuffer));
    NodeCL.checkError(error);

    imageSizeBuffer.set(0, uvImageSize.width - 1);
    imageSizeBuffer.set(1, uvImageSize.height - 1);
    error = cl.setKernelArg(kernel, 6, NodeCL.sizeof(imageSizeBuffer), NodeCL.byPointer(imageSizeBuffer));
    NodeCL.checkError(error);
    
    workSize.set(0, imageSize.width);
    workSize.set(1, imageSize.height);
    //log.info( imageFormat.imageChannelDataType);
    error = cl.enqueueNDRangeKernel(commandQueue, kernel, 2, null,
            NodeCL.byPointer(workSize), null, 0, null, null);
    NodeCL.checkError(error);
    //log.info( imageFormat.imageChannelDataType);
    cl.flush(commandQueue);
    cl.finish(commandQueue);
    //log.info( imageFormat.imageChannelDataType);

    originBuffer.set(0, 0);
    originBuffer.set(1, 0);
    originBuffer.set(2, 0);

    regionBuffer.set(0, imageSize.width);
    regionBuffer.set(1, imageSize.height);
    regionBuffer.set(2, 1);

    resultBuffer = NodeCL.newArray(Signature.int8, a.length,
            cl.enqueueMapImage(commandQueue, memY, true, cl.MAP_READ,
                    NodeCL.byPointer(originBuffer), NodeCL.byPointer(regionBuffer),
                    NodeCL.byPointer(pSize), null, 0, null, null, NodeCL.byPointer(pError)));
    NodeCL.checkError(pError);

    regionBuffer.set(0, uvImageSize.width);
    regionBuffer.set(1, uvImageSize.height);
    regionBuffer.set(2, 1);

    resultBuffer = NodeCL.newArray(Signature.int8, u.length,
            cl.enqueueMapImage(commandQueue, memU, true, cl.MAP_READ,
                    NodeCL.byPointer(originBuffer), NodeCL.byPointer(regionBuffer),
                    NodeCL.byPointer(pSize), null, 0, null, null, NodeCL.byPointer(pError)));
    NodeCL.checkError(pError);

    resultBuffer = NodeCL.newArray(Signature.int8, v.length,
            cl.enqueueMapImage(commandQueue, memV, true, cl.MAP_READ,
                    NodeCL.byPointer(originBuffer), NodeCL.byPointer(regionBuffer),
                    NodeCL.byPointer(pSize), null, 0, null, null, NodeCL.byPointer(pError)));
    NodeCL.checkError(pError);

    log.info(rgbToYuv([a.get(0), a.get(1), a.get(2)]));
    log.info(y.get(0) + ", " + u.get(1) + ", " + v.get(2));


    error = cl.enqueueUnmapMemObject(commandQueue, memY, NodeCL.byPointer(resultBuffer), 0, null, null);
    NodeCL.checkError(pError);

    error = cl.enqueueUnmapMemObject(commandQueue, memU, NodeCL.byPointer(resultBuffer), 0, null, null);
    NodeCL.checkError(pError);

    error = cl.enqueueUnmapMemObject(commandQueue, memV, NodeCL.byPointer(resultBuffer), 0, null, null);
    NodeCL.checkError(pError);

    error = cl.releaseKernel(kernel);
    NodeCL.checkError(error);

    error = cl.releaseProgram(program);
    NodeCL.checkError(error);

    error = cl.releaseMemObject(memA);
    NodeCL.checkError(error);

    error = cl.releaseMemObject(memY);
    NodeCL.checkError(error);

    error = cl.releaseMemObject(memU);
    NodeCL.checkError(error);

    error = cl.releaseMemObject(memV);
    NodeCL.checkError(error);

    error = cl.releaseCommandQueue(commandQueue);
    NodeCL.checkError(error);

    error = cl.releaseContext(context);
    NodeCL.checkError(error);

};



fs.readFile("examples/rgbToYuv.cl", 'utf8', function(err, data) {
    if (err) {
        log.fatal(err);
    } else {
        init(data);
    }

});





