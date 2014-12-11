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
var my = require("myclass"), bridjs = require("bridjs"), Utils = require("./utils"),
    Signature = bridjs.Signature, ImageDesc, BufferRegion,
    NodeCLException = require("./nodecl_exception"), Type = require("./cl_type"),
    cl11 = require("./cl_1_1"), lib;
lib = my.Class({
    STATIC: {
        getVersion: function () {
            return 1.2;
        }
    },
//   extern CL_API_ENTRY cl_int CL_API_CALL/
//clCreateSubDevices(cl_device_id                         /* in_device */,
//                   const cl_device_partition_property * /* properties */,
//                   cl_uint                              /* num_devices */,
//                 cl_device_id *                       /* out_devices */,
//                   cl_uint *                            /* num_devices_ret */) CL_API_SUFFIX__VERSION_1_2;
    createSubDevices: bridjs.defineFunction(Signature.int, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.pointer), Signature.uint, bridjs.byPointer(bridjs.NativeValue.pointer),
        bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateSubDevices"),

//extern CL_API_ENTRY cl_int CL_API_CALL
//clRetainDevice(cl_device_id /* device */) CL_API_SUFFIX__VERSION_1_2;
    retainDevice: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clRetainDevice"),


//extern CL_API_ENTRY cl_int CL_API_CALL
//clReleaseDevice(cl_device_id /* device */) CL_API_SUFFIX__VERSION_1_2; 
    releaseDevice: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clReleaseDevice"),

//extern CL_API_ENTRY cl_mem CL_API_CALL
//clCreateImage(cl_context              /* context */,
//              cl_mem_flags            /* flags */,
//              const cl_image_format * /* image_format */,
//              const cl_image_desc *   /* image_desc */, 
//              void *                  /* host_ptr */,
//              cl_int *                /* errcode_ret */) CL_API_SUFFIX__VERSION_1_2;

    createImage: bridjs.defineFunction(Type.mem, Signature.pointer, Type.memFlags, bridjs.byPointer(Type.ImageFormat), bridjs.byPointer(Type.ImageDesc), Signature.pointer,
        bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateImage"),

//extern CL_API_ENTRY cl_int CL_API_CALL
//clCompileProgram(cl_program           /* program */,
//                 cl_uint              /* num_devices */,
//                 const cl_device_id * /* device_list */,
//                 const char *         /* options */, 
//                 cl_uint              /* num_input_headers */,
//                 const cl_program *   /* input_headers */,
//                 const char **        /* header_include_names */,
//                 void (CL_CALLBACK *  /* pfn_notify */)(cl_program /* program */, void * /* user_data */),
//                 void *               /* user_data */) CL_API_SUFFIX__VERSION_1_2;

    compileProgram: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.uint, bridjs.byPointer(bridjs.NativeValue.pointer), Signature.string, Signature.uint,
        bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(bridjs.NativeValue.string), bridjs.byPointer(Type.buildProgramNotify), Signature.pointer).bind("clCompileProgram"),

//extern CL_API_ENTRY cl_program CL_API_CALL/
//clLinkProgram(cl_context           /* context */,
//              cl_uint              /* num_devices */,
//              const cl_device_id * /* device_list */,
//              const char *         /* options */, 
//              cl_uint              /* num_input_programs */,
//              const cl_program *   /* input_programs */,
//              void (CL_CALLBACK *  /* pfn_notify */)(cl_program /* program */, void * /* user_data */),
//              void *               /* user_data */,
//              cl_int *             /* errcode_ret */ ) CL_API_SUFFIX__VERSION_1_2;

    linkProgram: bridjs.defineFunction(Signature.pointer, Signature.pointer, Signature.uint, bridjs.byPointer(bridjs.NativeValue.pointer), Signature.string, Signature.uint,
        bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(Type.buildProgramNotify, bridjs.byPointer(bridjs.NativeValue.int)), Signature.pointer).bind("clLinkProgram"),

//extern CL_API_ENTRY cl_int CL_API_CALL
//clUnloadPlatformCompiler(cl_platform_id /* platform */) CL_API_SUFFIX__VERSION_1_2;
    unloadPlatformCompiler: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clUnloadPlatformCompiler"),

//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueFillBuffer(cl_command_queue   /* command_queue */,
//                    cl_mem             /* buffer */, 
//                    const void *       /* pattern */, 
//                    size_t             /* pattern_size */, 
//                    size_t             /* offset */, 
//                    size_t             /* size */, 
//                    cl_uint            /* num_events_in_wait_list */, 
//                    const cl_event *   /* event_wait_list */, 
//                    cl_event *         /* event */) CL_API_SUFFIX__VERSION_1_2;
    enqueueFillBuffer: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Signature.pointer, Signature.size, Signature.size, Signature.size, Signature.uint,
        bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(bridjs.NativeValue.pointer)).bind("clEnqueueFillBuffer"),


//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueFillImage(cl_command_queue   /* command_queue */,
//                   cl_mem             /* image */, 
//                   const void *       /* fill_color */, 
//                   const size_t *     /* origin[3] */, 
//                   const size_t *     /* region[3] */, 
//                   cl_uint            /* num_events_in_wait_list */, 
//                   const cl_event *   /* event_wait_list */, 
//                   cl_event *         /* event */) CL_API_SUFFIX__VERSION_1_2;

    enqueueFillImage: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.size),
        bridjs.byPointer(bridjs.NativeValue.size), Signature.uint,
        bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(bridjs.NativeValue.pointer)).bind("clEnqueueFillImage"),

//                   extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueMigrateMemObjects(cl_command_queue       /* command_queue */,
//                           cl_uint                /* num_mem_objects */,
//                           const cl_mem *         /* mem_objects */,
//                           cl_mem_migration_flags /* flags */,
//                           cl_uint                /* num_events_in_wait_list */,
//                           const cl_event *       /* event_wait_list */,
//                           cl_event *             /* event */) CL_API_SUFFIX__VERSION_1_2;
    enqueueMigrateMemObjects: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.uint, bridjs.byPointer(bridjs.NativeValue.pointer), Type.memMigrationFlags, Signature.uint,
        bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(bridjs.NativeValue.pointer)).bind("clEnqueueMigrateMemObjects"),


//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueMarkerWithWaitList(cl_command_queue /* command_queue */,
//                            cl_uint           /* num_events_in_wait_list */,
//                            const cl_event *  /* event_wait_list */,
//                            cl_event *        /* event */) CL_API_SUFFIX__VERSION_1_2;
    enqueueMarkerWithWaitList: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.uint,
        bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(bridjs.NativeValue.pointer)).bind("clEnqueueMarkerWithWaitList"),

//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueBarrierWithWaitList(cl_command_queue /* command_queue */,
//                             cl_uint           /* num_events_in_wait_list */,
//                             const cl_event *  /* event_wait_list */,
//                             cl_event *        /* event */) CL_API_SUFFIX__VERSION_1_2;
    enqueueBarrierWithWaitList: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.uint,
        bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(bridjs.NativeValue.pointer)).bind("clEnqueueBarrierWithWaitList"),
    /* Extension function access
     *
     * Returns the extension function address for the given function name,
     * or NULL if a valid function can not be found.  The client must
     * check to make sure the address is not NULL, before using or
     * calling the returned function address.
     */
//extern CL_API_ENTRY void * CL_API_CALL 
//clGetExtensionFunctionAddressForPlatform(cl_platform_id /* platform */,
//                                         const char *   /* func_name */) CL_API_SUFFIX__VERSION_1_2;                            
    getExtensionFunctionAddressForPlatfor: bridjs.defineFunction(Signature.pointer, Signature.pointer, Signature.string).bind("clGetExtensionFunctionAddressForPlatform"),
    //extern CL_API_ENTRY cl_int CL_API_CALL
//clGetKernelArgInfo(cl_kernel       /* kernel */,
//                   cl_uint         /* arg_indx */,
//                   cl_kernel_arg_info  /* param_name */,
//                   size_t          /* param_value_size */,
//                   void *          /* param_value */,
//                   size_t *        /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_2;
    getKernelArgInfo: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.uint, Type.kernelArgInfo,
        Signature.size, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetKernelArgInfo")
});

Utils.extend(lib, cl11);

module.exports = lib;