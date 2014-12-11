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
var my = require("myclass"), bridjs = require("bridjs"), log4js = require("log4js"),
        log = log4js.getLogger("NodeCL"), Type = require("./cl_type"),
        NodeCLException = require("./nodecl_exception"),
        Signature = bridjs.Signature, cl10 = require("./cl_1_0"),
        cl11 = require("./cl_1_1"), cl12 = require("./cl_1_2");

var libraries = [cl10, cl11, cl12];
/*
 for(i=0;i<libraries.length;++i){
 bridjs.register(libraries[i],"OpenCL");
 }*/

module.exports = my.Class({
    STATIC: {
        Type: Type,
        NativeValue: bridjs.NativeValue,
        Signature: bridjs.Signature,
        getDeviceInfoString: function(cl, deviceId, info) {
            var error, pSize2 = new bridjs.NativeValue.size(), buffer, str;

            error = cl.getDeviceInfo(deviceId, info, 0, null, bridjs.byPointer(pSize2));
            module.exports.checkError(error);
            buffer = new Buffer(pSize2.get());
            error = cl.getDeviceInfo(deviceId, info, buffer.length, buffer, null);
            module.exports.checkError(error);
            str = bridjs.toString(buffer);

            return str;
        },
        getDeviceInfoInt: function(cl,deviceId, info) {
            var error, pInt = new bridjs.NativeValue.int();

            error = cl.getDeviceInfo(deviceId, info, bridjs.sizeof(pInt), bridjs.byPointer(pInt), null);
            module.exports.checkError(error);

            return pInt.get();
        },
        findMaxFlopsDeviceFromContext: function(cl, pFlops, context, supportImage, extensions) {
            var maxFlops = -1, pSize = new bridjs.NativeValue.size(), error,
                    devices, deviceId, i, pDeviceType = new bridjs.newNativeValue(Type.deviceType),
                    /*pInt = new bridjs.NativeValue.int(),*/ j, deviceName, computeUnits,
                    frequency, temp, maxDeviceId = null, pBool = new bridjs.NativeValue.bool(),
                    deviceExtionStr, deviceType, processingElementsPerComputeUnit;

            error = cl.getContextInfo(context, cl.CONTEXT_DEVICES, 0, null, bridjs.byPointer(pSize));

            module.exports.checkError(error);

            devices = bridjs.newArray(Type.deviceId, pSize.get());
            bridjs.fill(devices, 0);
            error = cl.getContextInfo(context, cl.CONTEXT_DEVICES, devices.length, bridjs.byPointer(devices), bridjs.byPointer(pSize));
            module.exports.checkError(error);

            for (i = 0; i < pSize.get(); ++i) {
                deviceId = devices.get(i);
                if (deviceId !== null) {
                    //log.info(i);
                    /*        
                     error = this.getDeviceInfo(deviceId, this.DEVICE_NAME, 0, null, bridjs.byPointer(pSize2));
                     this.checkError(error);
                     deviceNameBuffer = new Buffer(pSize2.get());
                     error = this.getDeviceInfo(deviceId, this.DEVICE_NAME, deviceNameBuffer.length, deviceNameBuffer, null);
                     this.checkError(error);*/
                    deviceName = module.exports.getDeviceInfoString(cl, deviceId, cl.DEVICE_NAME);//bridjs.toString(deviceNameBuffer);
                    /*
                     error = this.getDeviceInfo(deviceId, this.DEVICE_EXTENSIONS, 0, null, bridjs.byPointer(pSize2));
                     this.checkError(error);
                     
                     deviceExtensions = new Buffer(pSize2.get());
                     error = this.getDeviceInfo(deviceId, this.DEVICE_EXTENSIONS, deviceExtensions.length, deviceExtensions, bridjs.byPointer(pSize2));
                     this.checkError(error);*/
                    deviceExtionStr = module.exports.getDeviceInfoString(cl, deviceId, cl.DEVICE_EXTENSIONS);//bridjs.toString(deviceExtensions);

                    //error = this.getDeviceInfo(deviceId, this.DEVICE_MAX_COMPUTE_UNITS, bridjs.sizeof(Signature.int), bridjs.byPointer(pInt), null);
                    //this.checkError(error);
                    computeUnits = this.getDeviceInfoInt(cl, deviceId, cl.DEVICE_MAX_COMPUTE_UNITS);// pInt.get();

                    // error = this.getDeviceInfo(deviceId, this.DEVICE_MAX_CLOCK_FREQUENCY, bridjs.sizeof(Signature.int), bridjs.byPointer(pInt), null);
                    // this.checkError(error);
                    frequency = module.exports.getDeviceInfoInt(cl, deviceId, cl.DEVICE_MAX_CLOCK_FREQUENCY);// pInt.get();

                    error = cl.getDeviceInfo( deviceId, cl.DEVICE_TYPE, bridjs.sizeof(pDeviceType), bridjs.byPointer(pDeviceType), null);
                    module.exports.checkError(error);
                    deviceType = pDeviceType.get();
                    processingElementsPerComputeUnit = 8;

                    if (deviceType !== cl.DEVICE_TYPE_GPU) {
                        processingElementsPerComputeUnit = 1;
                    } else if (deviceExtionStr.indexOf("cl_nv_device_attribute_query") >= 0) {
                        var majorNv = module.exports.getDeviceInfoInt(cl, deviceId, cl.DEVICE_COMPUTE_CAPABILITY_MAJOR_NV);//this.getDeviceInfo(deviceId, this.DEVICE_COMPUTE_CAPABILITY_MAJOR_NV,
                        //bridjs.sizeof(Signature.int), bridjs.byPointer(pInt), null);
                        module.exports.checkError(error);
                        processingElementsPerComputeUnit = (majorNv < 2 ? 8 : 32);
                    } else if (deviceExtionStr.indexOf("cl_amd_device_attribute_query") >= 0) {
                        // This attribute does not ensure that all queries are supported by the runtime (it may be an older runtime,
                        // or the CPU device) so still have to check for errors.
                        try {
                            processingElementsPerComputeUnit =
                                    // AMD GPUs either have a single VLIW SIMD or multiple scalar SIMDs.
                                    // The SIMD width is the number of threads the SIMD executes per cycle.
                                    // This will be less than the wavefront width since it takes several
                                    // cycles to execute the full wavefront.
                                    // The SIMD instruction width is the VLIW instruction width (or 1 for scalar),
                                    // this is the number of ALUs that can be executing per instruction per thread. 
                                    module.exports.getDeviceInfoInt(cl, deviceId, cl.DEVICE_SIMD_PER_COMPUTE_UNIT_AMD) *
                                    module.exports, getDeviceInfoInt(cl, deviceId, cl.DEVICE_SIMD_WIDTH_AMD) *
                                    module.exports.getDeviceInfoInt(cl, deviceId, cl.DEVICE_SIMD_INSTRUCTION_WIDTH_AMD);
                            // Just in case any of the queries return 0.
                            if (processingElementsPerComputeUnit <= 0) {
                                processingElementsPerComputeUnit = 1;
                            }
                        }
                        catch (e) {
                            // Runtime does not support the queries so use default.
                        }
                    }


                    temp = computeUnits * frequency * processingElementsPerComputeUnit;

                    log.debug("Find device: " + deviceName + " with flops = " + temp);


                    error = cl.getDeviceInfo(deviceId, cl.DEVICE_IMAGE_SUPPORT, bridjs.sizeof(Signature.bool), bridjs.byPointer(pBool), null);
                    module.exports.checkError(error);

                    if (supportImage && !pBool.get()) {
                        continue;
                    } else {
                        if (extensions) {
                            //var str = bridjs.toString(deviceExtensions);
                            //log.info(deviceExtionStr);
                            for (j = 0; j < extensions.length; ++j) {
                                if (deviceExtionStr.indexOf(extensions[j]) < 0) {
                                    log.debug("Unqualified device: " + deviceName + " for " + extensions[j]);
                                    temp = -1;
                                    break;
                                }
                            }
                        }

                        if (temp > maxFlops) {
                            maxFlops = temp;
                            maxDeviceId = deviceId;
                        }
                    }
                    ///log.info(pInt.get());
                }
            }
            pFlops.set(maxFlops);
            return maxDeviceId;
        },
        findMaxFlopsDevice: function(cl, deviceType, supportImage, extensions) {
            var plaformIds, numPlatforms = new bridjs.NativeValue.uint(),
                    error, i, platformId, pFlops = new bridjs.NativeValue.double(),
                    contextProperties = bridjs.newArray(Type.platformId, 3), context,
                    pError = new bridjs.NativeValue.int(),
                    maxFlopsDeviceId = null, maxFlops = -1, deviceId, maxPlatformId = null;

            error = cl.getPlatformIDs(0, null, bridjs.byPointer(numPlatforms));

            module.exports.checkError(error);

            plaformIds = bridjs.newArray(Type.platformId, numPlatforms.get());

            error = cl.getPlatformIDs(plaformIds.length, bridjs.byPointer(plaformIds),
                    bridjs.byPointer(numPlatforms));

            contextProperties.set(0, cl.CONTEXT_PLATFORM);
            contextProperties.set(2, 0);
            for (i = 0; i < numPlatforms.get(); ++i) {
                platformId = plaformIds.get(i);
                contextProperties.set(1, platformId);

                context = cl.createContextFromType(bridjs.byPointer(contextProperties), deviceType,
                        null, null, bridjs.byPointer(pError));
                //log.info(context);
                if (pError.get() !== cl.DEVICE_NOT_FOUND) {
                    module.exports.checkError(pError);

                    deviceId = module.exports.findMaxFlopsDeviceFromContext(cl, pFlops, context, supportImage, extensions);

                    if (pFlops.get() > maxFlops) {
                        maxFlops = pFlops.get();
                        maxFlopsDeviceId = deviceId;
                        maxPlatformId = platformId;
                    }
                    cl.releaseContext(context);
                    context = null;
                }
            }
            return {platformId: maxPlatformId, deviceId: maxFlopsDeviceId};
            //log.info(maxFlopsDeviceId);
        },
        checkError: function(errorCode) {
            var value;

            if (typeof (errorCode) === "number") {
                value = errorCode;
            } else {
                value = errorCode.get();
            }

            if (value !== 0) {
                throw new NodeCLException("OpenCL error :" + value);
            }
        },
        newArray: function(type, length, ptr) {
            return bridjs.newArray(type, length, ptr);
        },
        byPointer: function(obj) {
            return bridjs.byPointer(obj);
        },
        sizeof: function(obj) {
            return bridjs.sizeof(obj);
        },
        load: function(version) {
            var i, selectIndex = libraries.length - 1, lib;

            if (version === null || version === undefined) {
                version = libraries[libraries.length - 1].getVersion();
            } else if (typeof (version) === "string") {
                version = parseFloat(version);
            }

            for (i = 0; i < libraries.length; ++i) {
                //log.info(i);
                if (version <= libraries[i].getVersion()) {
                    selectIndex = i;
                    break;
                }
            }
            lib = libraries[selectIndex];
            bridjs.register(lib, /^win/.test(process.platform) ? "OpenCL" : "libOpenCL.so");
            log.info("Load OpenCL library: " + lib.getVersion());

            return new lib();
        },
        
        toString:function(str){
            return bridjs.toString(str);
        }
    }
});
