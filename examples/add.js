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

init = function(kernelCode) {
    var fastDeviceInfo = NodeCL.findMaxFlopsDevice(cl,cl.DEVICE_TYPE_ALL, true, null),
            contextProperties = NodeCL.newArray(Type.platformId, 3), context, commandQueue,
            pError = new NodeCL.NativeValue.int(), error, a = NodeCL.newArray(Signature.int, 3),
            b = NodeCL.newArray(Signature.int, 3), c = NodeCL.newArray(Signature.int, 3),
            memA, memB, memC, program, pPtr = new NodeCL.newArray(Signature.pointer, 1),
            pSize = new NodeCL.newArray(Signature.size, 1), kernel,
            kernelCodeBuffer = new Buffer(kernelCode, "utf8"), resultBuffer;
    
    log.info("Using device: "+NodeCL.getDeviceInfoString(cl,fastDeviceInfo.deviceId, cl.DEVICE_NAME));
    
    contextProperties.set(0, cl.CONTEXT_PLATFORM);
    contextProperties.set(1, fastDeviceInfo.platformId);
    contextProperties.set(2, 0);
    context = cl.createContextFromType(NodeCL.byPointer(contextProperties), cl.DEVICE_TYPE_ALL,
            null, null, NodeCL.byPointer(pError));

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
        error = cl.getProgramBuildInfo(program, fastDeviceInfo.deviceId,cl.PROGRAM_BUILD_LOG,
                0, null, NodeCL.byPointer(pSize));
                
        NodeCL.checkError(error);        
                
        strBuffer = new Buffer(pSize.get(0));
        log.info(pSize.get(0));
        error = cl.getProgramBuildInfo(program, fastDeviceInfo.deviceId, cl.PROGRAM_BUILD_LOG,
                strBuffer.length, strBuffer, NodeCL.byPointer(pSize));
        NodeCL.checkError(error);    
        
        str =   NodeCL.toString(strBuffer);      
        log.warn(str);
        
        throw new Error(str);
    }

    NodeCL.checkError(error);
    // Create the OpenCL kernel
    kernel = cl.createKernel(program, "vector_add", NodeCL.byPointer(pError));
    NodeCL.checkError(pError);

    a.set(0, 1);
    a.set(1, 2);
    a.set(2, 3);
    b.set(0, 3);
    b.set(1, 2);
    b.set(2, 1);
    c.set(0, 0);
    c.set(1, 0);
    c.set(2, 0);
    memA = cl.createBuffer(context, cl.MEM_READ_ONLY | cl.MEM_USE_HOST_PTR,
            NodeCL.sizeof(a), NodeCL.byPointer(a), NodeCL.byPointer(pError));
    NodeCL.checkError(pError);

    memB = cl.createBuffer(context, cl.MEM_READ_ONLY | cl.MEM_USE_HOST_PTR,
            NodeCL.sizeof(b), NodeCL.byPointer(b), NodeCL.byPointer(pError));
    NodeCL.checkError(pError);

    memC = cl.createBuffer(context, cl.MEM_WRITE_ONLY | cl.MEM_USE_HOST_PTR,
            NodeCL.sizeof(c), NodeCL.byPointer(c), NodeCL.byPointer(pError));
    NodeCL.checkError(pError);


    pPtr.set(0, memA);
    error = cl.setKernelArg(kernel, 0, NodeCL.sizeof(Type.mem), NodeCL.byPointer(pPtr));
    NodeCL.checkError(error);

    pPtr.set(0, memB);
    error = cl.setKernelArg(kernel, 1, NodeCL.sizeof(Type.mem), NodeCL.byPointer(pPtr));
    NodeCL.checkError(error);

    pPtr.set(0, memC);
    error = cl.setKernelArg(kernel, 2, NodeCL.sizeof(Type.mem), NodeCL.byPointer(pPtr));
    NodeCL.checkError(error);

    pSize.set(0, 3);
    error = cl.enqueueNDRangeKernel(commandQueue, kernel, 1, null,
            NodeCL.byPointer(pSize), null, 0, null, null);
    NodeCL.checkError(error);
    
        cl.flush(commandQueue);
    cl.finish(commandQueue);

    resultBuffer = NodeCL.newArray(Signature.int, c.length, 
        cl.enqueueMapBuffer(commandQueue, memC, true, cl.MAP_READ, 
        0,  NodeCL.sizeof(c), 0, null, null, NodeCL.byPointer(pError)));
    NodeCL.checkError(pError);

    
    log.info(resultBuffer.get(0) + ", " +resultBuffer.get(1) + ", " + resultBuffer.get(2));
    
    
    error = cl.enqueueUnmapMemObject(commandQueue, memC, NodeCL.byPointer(resultBuffer), 0,null, null);
    NodeCL.checkError(pError);
    
    error = cl.releaseKernel(kernel);
    NodeCL.checkError(error);

    error = cl.releaseProgram(program);
    NodeCL.checkError(error);

    error = cl.releaseMemObject(memA);
    NodeCL.checkError(error);

    error = cl.releaseMemObject(memB);
    NodeCL.checkError(error);

    error = cl.releaseMemObject(memC);
    NodeCL.checkError(error);

    error = cl.releaseCommandQueue(commandQueue);
    NodeCL.checkError(error);

    error = cl.releaseContext(context);
    NodeCL.checkError(error);
};



fs.readFile("examples/add.cl", 'utf8', function(err, data) {
    if (err) {
        log.fatal(err);
    } else {
        init(data);
    }

});





