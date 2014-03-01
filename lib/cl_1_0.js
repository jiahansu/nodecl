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
var my = require("myclass"), bridjs = require("bridjs"), ClBase = require("./cl_base"),
        Signature = bridjs.Signature, ImageDesc, BufferRegion, Utils = require("./utils"),
        NodeCLException = require("./nodecl_exception"), Type = require("./cl_type"),
        log4js = require("log4js"),
        log = log4js.getLogger("Cl10");



module.exports = my.Class({
    STATIC: {
        getVersion: function() {
            return 1.0;
        }
    },
    /* Platform API */

//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetPlatformIDs(cl_uint          /* num_entries */,
//                 cl_platform_id * /* platforms */,
    //                cl_uint *        /* num_platforms */) CL_API_SUFFIX__VERSION_1_0;
    getPlatformIDs: bridjs.defineFunction(Signature.int, Signature.uint, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.uint)).bind("clGetPlatformIDs"),
//extern CL_API_ENTRY cl_int CL_API_CALL 
//clGetPlatformInfo(cl_platform_id   /* platform */, 
//                  cl_platform_info /* param_name */,
//                  size_t           /* param_value_size */, 
//                  void *           /* param_value */,
//                  size_t *         /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;

    getPlatformInfo: bridjs.defineFunction(Signature.int, Type.platformId, Type.platformInfo, Signature.size, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetPlatformInfo"),
    /* Device APIs */
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetDeviceIDs(cl_platform_id   /* platform */,
//               cl_device_type   /* device_type */, 
//               cl_uint          /* num_entries */, 
//               cl_device_id *   /* devices */, 
//               cl_uint *        /* num_devices */) CL_API_SUFFIX__VERSION_1_0;
    getDeviceIDs: bridjs.defineFunction(Signature.int, Type.platformId, Type.deviceType, Signature.uint, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.uint)).bind("clGetDeviceIDs"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetDeviceInfo(cl_device_id    /* device */,
//                cl_device_info  /* param_name */, 
    //               size_t          /* param_value_size */, 
    //               void *          /* param_value */,
    //               size_t *        /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
    getDeviceInfo: bridjs.defineFunction(Signature.int, Type.platformId, Type.deviceInfo, Signature.size, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetDeviceInfo"),
    /* Context APIs  */
//extern CL_API_ENTRY cl_context CL_API_CALL
//clCreateContext(const cl_context_properties * /* properties */,
//                cl_uint                 /* num_devices */,
//                const cl_device_id *    /* devices */,
//                void (CL_CALLBACK * /* pfn_notify */)(const char *, const void *, size_t, void *),
//                void *                  /* user_data */,
//                cl_int *                /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
    createContext: bridjs.defineFunction(Signature.pointer, Signature.uint, Signature.pointer,
            bridjs.byPointer(Type.createContextNotify),
            Signature.pointer, bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateContext"),
//extern CL_API_ENTRY cl_context CL_API_CALL
//clCreateContextFromType(const cl_context_properties * /* properties */,
//                        cl_device_type          /* device_type */,
//                        void (CL_CALLBACK *     /* pfn_notify*/ )(const char *, const void *, size_t, void *),
//                        void *                  /* user_data */,
//                        cl_int *                /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
    createContextFromType: bridjs.defineFunction(Signature.pointer, Signature.pointer, Type.deviceType,
            bridjs.byPointer(Type.createContextNotify),
            Signature.pointer, bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateContextFromType"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clRetainContext(cl_context /* context */) CL_API_SUFFIX__VERSION_1_0;
    retainContext: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clRetainContext"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clReleaseContext(cl_context /* context */) CL_API_SUFFIX__VERSION_1_0;
    releaseContext: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clReleaseContext"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetContextInfo(cl_context         /* context */, 
//                 cl_context_info    /* param_name */, 
//                 size_t             /* param_value_size */, 
//                 void *             /* param_value */, 
//                 size_t *           /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
    getContextInfo: bridjs.defineFunction(Signature.int, Signature.pointer, Type.contextInfo,
            Signature.size,
            Signature.pointer, bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetContextInfo"),
    /* Command Queue APIs */
//extern CL_API_ENTRY cl_command_queue CL_API_CALL
//clCreateCommandQueue(cl_context                     /* context */, 
//                     cl_device_id                   /* device */, 
//                     cl_command_queue_properties    /* properties */,
//                     cl_int *                       /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
    createCommandQueue: bridjs.defineFunction(Signature.pointer, Signature.pointer, Type.deviceId,
            Signature.pointer, bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateCommandQueue"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clRetainCommandQueue(cl_command_queue /* command_queue */) CL_API_SUFFIX__VERSION_1_0;
    retainCommandQueue: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clRetainCommandQueue"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clReleaseCommandQueue(cl_command_queue /* command_queue */) CL_API_SUFFIX__VERSION_1_0;
    releaseCommandQueue: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clReleaseCommandQueue"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetCommandQueueInfo(cl_command_queue      /* command_queue */,
//                      cl_command_queue_info /* param_name */,
//                      size_t                /* param_value_size */,
//                      void *                /* param_value */,
//                      size_t *              /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
    getCommandQueueInfo: bridjs.defineFunction(Signature.int, Type.commandQueue, Type.commandQueueInfo, Signature.size,
            Signature.pointer, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.int)).bind("clGetCommandQueueInfo"),
    /* Memory Object APIs */
//extern CL_API_ENTRY cl_mem CL_API_CALL
//clCreateBuffer(cl_context   /* context */,
//               cl_mem_flags /* flags */,
//               size_t       /* size */,
//               void *       /* host_ptr */,
//               cl_int *     /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
    createBuffer: bridjs.defineFunction(Type.mem, Signature.pointer, Type.memFlags, Signature.size,
            Signature.pointer, bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateBuffer"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clRetainMemObject(cl_mem /* memobj */) CL_API_SUFFIX__VERSION_1_0;
    retainMemObject: bridjs.defineFunction(Signature.int, Type.mem).bind("clRetainMemObject"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clReleaseMemObject(cl_mem /* memobj */) CL_API_SUFFIX__VERSION_1_0;
    releaseMemObject: bridjs.defineFunction(Signature.int, Type.mem).bind("clReleaseMemObject"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetSupportedImageFormats(cl_context           /* context */,
//                           cl_mem_flags         /* flags */,
//                           cl_mem_object_type   /* image_type */,
//                           cl_uint              /* num_entries */,
//                           cl_image_format *    /* image_formats */,
//                           cl_uint *            /* num_image_formats */) CL_API_SUFFIX__VERSION_1_0;
    getSupportedImageFormats: bridjs.defineFunction(Signature.int, Type.context, Type.memFlags, Type.memObjectType, Signature.uint,
            Signature.pointer, bridjs.byPointer(bridjs.NativeValue.uint)).bind("clGetSupportedImageFormats"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetMemObjectInfo(cl_mem           /* memobj */,
//                   cl_mem_info      /* param_name */, 
//                   size_t           /* param_value_size */,
//                   void *           /* param_value */,
//                   size_t *         /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
    getMemObjectInfo: bridjs.defineFunction(Signature.int, Type.mem, Type.memInfo, Signature.size,
            Signature.pointer, bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetMemObjectInfo"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetImageInfo(cl_mem           /* image */,
//               cl_image_info    /* param_name */, 
//               size_t           /* param_value_size */,
//               void *           /* param_value */,
//               size_t *         /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
    getImageInfo: bridjs.defineFunction(Signature.int, Type.mem, Type.memInfo, Signature.size,
            Signature.pointer, bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetImageInfo"),
    /* Sampler APIs */
//extern CL_API_ENTRY cl_sampler CL_API_CALL
//clCreateSampler(cl_context          /* context */,
//                cl_bool             /* normalized_coords */, 
//                cl_addressing_mode  /* addressing_mode */, 
//                cl_filter_mode      /* filter_mode */,
//                cl_int *            /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
    createSampler: bridjs.defineFunction(Signature.pointer, Signature.pointer, Signature.bool, Type.addressingMode, Type.filterMode,
            bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateSampler"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clRetainSampler(cl_sampler /* sampler */) CL_API_SUFFIX__VERSION_1_0;
    retainSampler: bridjs.defineFunction(Signature.int).bind("clRetainSampler"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clReleaseSampler(cl_sampler /* sampler */) CL_API_SUFFIX__VERSION_1_0;
    releaseSampler: bridjs.defineFunction(Signature.int).bind("clReleaseSampler"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetSamplerInfo(cl_sampler         /* sampler */,
//                 cl_sampler_info    /* param_name */,
//                 size_t             /* param_value_size */,
//                 void *             /* param_value */,
//                 size_t *           /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
    getSamplerInfo: bridjs.defineFunction(Signature.int, Signature.pointer, Type.samplerInfo, Signature.size, Signature.pointer,
            bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetSamplerInfo"),
    /* Program Object APIs  */
//extern CL_API_ENTRY cl_program CL_API_CALL
//clCreateProgramWithSource(cl_context        /* context */,
//                          cl_uint           /* count */,
//                          const char **     /* strings */,
//                          const size_t *    /* lengths */,
//                          cl_int *          /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
    createProgramWithSource: bridjs.defineFunction(Signature.pointer, Signature.pointer, Signature.uint, bridjs.byPointer(bridjs.NativeValue.string),
            bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateProgramWithSource"),
//extern CL_API_ENTRY cl_program CL_API_CALL
//clCreateProgramWithBinary(cl_context                     /* context */,
//                          cl_uint                        /* num_devices */,
//                          const cl_device_id *           /* device_list */,
//                          const size_t *                 /* lengths */,
//                          const unsigned char **         /* binaries */,
//                          cl_int *                       /* binary_status */,
//                          cl_int *                       /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
    createProgramWithBinary: bridjs.defineFunction(Signature.pointer, Signature.pointer, Signature.uint, Signature.pointer,
            bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(bridjs.NativeValue.int), bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateProgramWithBinary"),
//extern CL_API_ENTRY cl_program CL_API_CALL
//clCreateProgramWithBuiltInKernels(cl_context            /* context */,
//                                  cl_uint               /* num_devices */,
//                                  const cl_device_id *  /* device_list */,
//                                  const char *          /* kernel_names */,
//                                  cl_int *              /* errcode_ret */) CL_API_SUFFIX__VERSION_1_2;
    createProgramWithBuiltInKernels: bridjs.defineFunction(Signature.pointer, Signature.pointer, Signature.uint, bridjs.byPointer(bridjs.NativeValue.pointer),
            Signature.string, bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateProgramWithBuiltInKernels"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clRetainProgram(cl_program /* program */) CL_API_SUFFIX__VERSION_1_0;
    retainProgram: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clRetainProgram"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clReleaseProgram(cl_program /* program */) CL_API_SUFFIX__VERSION_1_0;
    releaseProgram: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clReleaseProgram"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clBuildProgram(cl_program           /* program */,
    //              cl_uint              /* num_devices */,
    //              const cl_device_id * /* device_list */,
    //              const char *         /* options */, 
    //              void (CL_CALLBACK *  /* pfn_notify */)(cl_program /* program */, void * /* user_data */),
    //              void *               /* user_data */) CL_API_SUFFIX__VERSION_1_0;
    buildProgram: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.uint, bridjs.byPointer(bridjs.NativeValue.pointer),
            Signature.string, bridjs.byPointer(Type.buildProgramNotify), Signature.pointer).bind("clBuildProgram"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetProgramInfo(cl_program         /* program */,
//                 cl_program_info    /* param_name */,
//                 size_t             /* param_value_size */,
//                 void *             /* param_value */,
//                 size_t *           /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
    getProgramInfo: bridjs.defineFunction(Signature.int, Signature.pointer, Type.programInfo, Signature.size,Signature.pointer,
            bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetProgramInfo"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetProgramBuildInfo(cl_program            /* program */,
//                      cl_device_id          /* device */,
//                      cl_program_build_info /* param_name */,
//                      size_t                /* param_value_size */,
//                      void *                /* param_value */,
//                      size_t *              /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
    getProgramBuildInfo: bridjs.defineFunction(Signature.int, Signature.pointer, Type.deviceId, Type.programBuildInfo, Signature.size, Signature.pointer,
            bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetProgramBuildInfo"),
    /* Kernel Object APIs */
//extern CL_API_ENTRY cl_kernel CL_API_CALL
//clCreateKernel(cl_program      /* program */,
//               const char *    /* kernel_name */,
//               cl_int *        /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
    createKernel: bridjs.defineFunction(Signature.pointer, Signature.pointer,
            Signature.string, bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateKernel"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clCreateKernelsInProgram(cl_program     /* program */,
//                         cl_uint        /* num_kernels */,
//                         cl_kernel *    /* kernels */,
//                         cl_uint *      /* num_kernels_ret */) CL_API_SUFFIX__VERSION_1_0;
    createKernelsInProgram: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.uint,
            bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(bridjs.NativeValue.uint)).bind("clCreateKernelsInProgram"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clRetainKernel(cl_kernel    /* kernel */) CL_API_SUFFIX__VERSION_1_0;
    retainKernel: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clRetainKernel"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clReleaseKernel(cl_kernel   /* kernel */) CL_API_SUFFIX__VERSION_1_0;
    releaseKernel: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clReleaseKernel"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clSetKernelArg(cl_kernel    /* kernel */,
//               cl_uint      /* arg_index */,
//               size_t       /* arg_size */,
//               const void * /* arg_value */) CL_API_SUFFIX__VERSION_1_0;
//extern CL_API_ENTRY cl_int CL_API_CALL
//clReleaseKernel(cl_kernel   /* kernel */) CL_API_SUFFIX__VERSION_1_0;
    setKernelArg: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.uint, Signature.size, Signature.pointer).bind("clSetKernelArg"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetKernelInfo(cl_kernel       /* kernel */,
//                cl_kernel_info  /* param_name */,
//                size_t          /* param_value_size */,
//                void *          /* param_value */,
//                size_t *        /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
    getKernelInfo: bridjs.defineFunction(Signature.int, Signature.pointer, Type.kernelInfo,
            Signature.size, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetKernelInfo"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetKernelArgInfo(cl_kernel       /* kernel */,
//                   cl_uint         /* arg_indx */,
//                   cl_kernel_arg_info  /* param_name */,
//                   size_t          /* param_value_size */,
//                   void *          /* param_value */,
//                   size_t *        /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_2;
    getKernelArgInfo: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.uint, Type.kernelArgInfo,
            Signature.size, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetKernelArgInfo"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetKernelWorkGroupInfo(cl_kernel                  /* kernel */,
//                         cl_device_id               /* device */,
//                         cl_kernel_work_group_info  /* param_name */,
//                         size_t                     /* param_value_size */,
//                         void *                     /* param_value */,
//                         size_t *                   /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
    getKernelWorkGroupInfo: bridjs.defineFunction(Signature.int, Signature.pointer, Type.deviceId, Type.kernelWorkGroupInfo,
            Signature.size, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetKernelWorkGroupInfo"),
    /* Event Object APIs */
//extern CL_API_ENTRY cl_int CL_API_CALL
//clWaitForEvents(cl_uint             /* num_events */,
//                const cl_event *    /* event_list */) CL_API_SUFFIX__VERSION_1_0;
    waitForEvents: bridjs.defineFunction(Signature.uint, Signature.pointer).bind("clWaitForEvents"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetEventInfo(cl_event         /* event */,
//               cl_event_info    /* param_name */,
//               size_t           /* param_value_size */,
//               void *           /* param_value */,
//               size_t *         /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
    getEventInfo: bridjs.defineFunction(Signature.int, Signature.pointer, Type.eventInfo,
            Signature.size, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetEventInfo"),
//extern CL_API_ENTRY cl_event CL_API_CALL
//clCreateUserEvent(cl_context    /* context */,
    //                 cl_int *      /* errcode_ret */) CL_API_SUFFIX__VERSION_1_1;               
    createUserEvent: bridjs.defineFunction(Signature.pointer,
            bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateUserEvent"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clRetainEvent(cl_event /* event */) CL_API_SUFFIX__VERSION_1_0;
    createRetainEvent: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clRetainEvent"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clReleaseEvent(cl_event /* event */) CL_API_SUFFIX__VERSION_1_0;
    releaseEvent: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clReleaseEvent"),
    /* Profiling APIs */
//extern CL_API_ENTRY cl_int CL_API_CALL
//clGetEventProfilingInfo(cl_event            /* event */,
//                        cl_profiling_info   /* param_name */,
//                        size_t              /* param_value_size */,
//                        void *              /* param_value */,
//                        size_t *            /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
//extern CL_API_ENTRY cl_int CL_API_CALL
//clReleaseEvent(cl_event /* event */) CL_API_SUFFIX__VERSION_1_0;
    getEventProfilingInfo: bridjs.defineFunction(Signature.int, Signature.pointer, Type.profilingInfo, Signature.size,
            Signature.pointer, bridjs.byPointer(bridjs.NativeValue.size)).bind("clGetEventProfilingInfo"),
    /* Flush and Finish APIs */
//extern CL_API_ENTRY cl_int CL_API_CALL
//clFlush(cl_command_queue /* command_queue */) CL_API_SUFFIX__VERSION_1_0;
    flush: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clFlush"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clFinish(cl_command_queue /* command_queue */) CL_API_SUFFIX__VERSION_1_0;
    finish: bridjs.defineFunction(Signature.int, Signature.pointer).bind("clFinish"),
    /* Enqueued Commands APIs */
//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueReadBuffer(cl_command_queue    /* command_queue */,
//                   cl_mem              /* buffer */,
//                    cl_bool             /* blocking_read */,
//                    size_t              /* offset */,
//                    size_t              /* size */, 
//                    void *              /* ptr */,
//                    cl_uint             /* num_events_in_wait_list */,
//                    const cl_event *    /* event_wait_list */,
//                    cl_event *          /* event */) CL_API_SUFFIX__VERSION_1_0;
    enqueueReadBuffer: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Signature.bool,
            Signature.size, Signature.size, Signature.pointer, Signature.uint, Signature.pointer, Signature.pointer).bind("clEnqueueReadBuffer"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueWriteBuffer(cl_command_queue   /* command_queue */, 
//                     cl_mem             /* buffer */, 
//                     cl_bool            /* blocking_write */, 
//                     size_t             /* offset */, 
//                     size_t             /* size */, 
//                     const void *       /* ptr */, 
//                     cl_uint            /* num_events_in_wait_list */, 
//                     const cl_event *   /* event_wait_list */, 
//                     cl_event *         /* event */) CL_API_SUFFIX__VERSION_1_0;
    enqueueWriteBuffer: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Signature.bool,
            Signature.size, Signature.size, Signature.pointer, Signature.uint, Signature.pointer, Signature.pointer).bind("clEnqueueWriteBuffer"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueCopyBuffer(cl_command_queue    /* command_queue */, 
//                    cl_mem              /* src_buffer */,
//                    cl_mem              /* dst_buffer */, 
//                    size_t              /* src_offset */,
//                    size_t              /* dst_offset */,
//                    size_t              /* size */, 
//                    cl_uint             /* num_events_in_wait_list */,
//                   const cl_event *    /* event_wait_list */,
//                    cl_event *          /* event */) CL_API_SUFFIX__VERSION_1_0;
    enqueueCopyBuffer: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Type.mem,
            Signature.size, Signature.size, Signature.size, Signature.uint, Signature.pointer, Signature.pointer).bind("clEnqueueCopyBuffer"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueReadImage(cl_command_queue     /* command_queue */,
//                   cl_mem               /* image */,
//                   cl_bool              /* blocking_read */, 
//                   const size_t *       /* origin[3] */,
//                   const size_t *       /* region[3] */,
//                   size_t               /* row_pitch */,
//                   size_t               /* slice_pitch */, 
//                   void *               /* ptr */,
//                   cl_uint              /* num_events_in_wait_list */,
//                   const cl_event *     /* event_wait_list */,
//                   cl_event *           /* event */) CL_API_SUFFIX__VERSION_1_0;

    enqueueReadImage: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Signature.bool,
            Signature.pointer, Signature.pointer, Signature.size, Signature.size, Signature.pointer, Signature.uint, Signature.pointer, Signature.pointer).bind("clEnqueueReadImage"),
//extern CL_API_ENTRY cl_int CL_API_CALL/
//clEnqueueWriteImage(cl_command_queue    /* command_queue */,
//                    cl_mem              /* image */,
//                    cl_bool             /* blocking_write */, 
//                    const size_t *      /* origin[3] */,
//                    const size_t *      /* region[3] */,
//                    size_t              /* input_row_pitch */,
//                    size_t              /* input_slice_pitch */, 
//                    const void *        /* ptr */,
//                    cl_uint             /* num_events_in_wait_list */,
//                   const cl_event *    /* event_wait_list */,
//                    cl_event *          /* event */) CL_API_SUFFIX__VERSION_1_0;
    enqueueWriteImage: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Signature.bool,
            Signature.pointer, Signature.pointer, Signature.size, Signature.size, Signature.pointer, Signature.uint, Signature.pointer, Signature.pointer).bind("clEnqueueWriteImage"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueCopyImage(cl_command_queue     /* command_queue */,
//                   cl_mem               /* src_image */,
//                   cl_mem               /* dst_image */, 
//                   const size_t *       /* src_origin[3] */,
//                   const size_t *       /* dst_origin[3] */,
//                   const size_t *       /* region[3] */, 
//                   cl_uint              /* num_events_in_wait_list */,
//                   const cl_event *     /* event_wait_list */,
//                   cl_event *           /* event */) CL_API_SUFFIX__VERSION_1_0;

    enqueueCopyImage: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Type.mem,
            Signature.pointer, Signature.pointer, Signature.pointer, Signature.uint, Signature.pointer, Signature.pointer).bind("clEnqueueCopyImage"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueCopyImageToBuffer(cl_command_queue /* command_queue */,
//                           cl_mem           /* src_image */,
//                           cl_mem           /* dst_buffer */, 
//                           const size_t *   /* src_origin[3] */,
//                           const size_t *   /* region[3] */, 
//                           size_t           /* dst_offset */,
//                           cl_uint          /* num_events_in_wait_list */,
//                           const cl_event * /* event_wait_list */,
//                           cl_event *       /* event */) CL_API_SUFFIX__VERSION_1_0;
    enqueueCopyImageToBuffer: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Type.mem,
            Signature.pointer, Signature.pointer, Signature.size, Signature.uint, Signature.pointer, Signature.pointer).bind("clEnqueueCopyImageToBuffer"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueCopyBufferToImage(cl_command_queue /* command_queue */,
//                           cl_mem           /* src_buffer */,
//                           cl_mem           /* dst_image */, 
//                           size_t           /* src_offset */,
//                           const size_t *   /* dst_origin[3] */,
//                           const size_t *   /* region[3] */, 
//                           cl_uint          /* num_events_in_wait_list */,
//                           const cl_event * /* event_wait_list */,
//                           cl_event *       /* event */) CL_API_SUFFIX__VERSION_1_0;
    enqueueCopyBufferToImage: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Type.mem, Signature.size,
            Signature.pointer, Signature.pointer, Signature.uint, Signature.pointer, Signature.pointer).bind("clEnqueueCopyBufferToImage"),
//extern CL_API_ENTRY void * CL_API_CALL
//clEnqueueMapBuffer(cl_command_queue /* command_queue */,
//                   cl_mem           /* buffer */,
//                   cl_bool          /* blocking_map */, 
//                   cl_map_flags     /* map_flags */,
//                   size_t           /* offset */,
//                   size_t           /* size */,
//                   cl_uint          /* num_events_in_wait_list */,
//                   const cl_event * /* event_wait_list */,
//                   cl_event *       /* event */,
//                   cl_int *         /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
    enqueueMapBuffer: bridjs.defineFunction(Signature.pointer, Signature.pointer, Type.mem, Signature.bool,
            Type.mapFlags, Signature.size, Signature.size, Signature.uint, Signature.pointer, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.int)).bind("clEnqueueMapBuffer"),
//extern CL_API_ENTRY void * CL_API_CALL
//clEnqueueMapImage(cl_command_queue  /* command_queue */,
//                  cl_mem            /* image */, 
//                  cl_bool           /* blocking_map */, 
//                  cl_map_flags      /* map_flags */, 
//                  const size_t *    /* origin[3] */,
//                  const size_t *    /* region[3] */,
//                  size_t *          /* image_row_pitch */,
//                  size_t *          /* image_slice_pitch */,
//                  cl_uint           /* num_events_in_wait_list */,
//                  const cl_event *  /* event_wait_list */,
//                  cl_event *        /* event */,
//                  cl_int *          /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
    enqueueMapImage: bridjs.defineFunction(Signature.pointer, Signature.pointer, Type.mem, Signature.bool,
            Type.mapFlags, bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.size),
            Signature.uint, Signature.pointer, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.int)).bind("clEnqueueMapImage"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueUnmapMemObject(cl_command_queue /* command_queue */,
//                        cl_mem           /* memobj */,
//                        void *           /* mapped_ptr */,
//                        cl_uint          /* num_events_in_wait_list */,
//                        const cl_event *  /* event_wait_list */,
//                        cl_event *        /* event */) CL_API_SUFFIX__VERSION_1_0;
    enqueueUnmapMemObject: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Signature.pointer,
            Signature.uint, Signature.pointer, Signature.pointer).bind("clEnqueueUnmapMemObject"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueNDRangeKernel(cl_command_queue /* command_queue */,
//                       cl_kernel        /* kernel */,
//                       cl_uint          /* work_dim */,
//                       const size_t *   /* global_work_offset */,
//                       const size_t *   /* global_work_size */,
//                       const size_t *   /* local_work_size */,
//                       cl_uint          /* num_events_in_wait_list */,
//                       const cl_event * /* event_wait_list */,
//                       cl_event *       /* event */) CL_API_SUFFIX__VERSION_1_0;
    enqueueNDRangeKernel: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.pointer,
            Signature.uint, bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.size),
            Signature.uint,
            Signature.pointer, Signature.pointer).bind("clEnqueueNDRangeKernel"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueTask(cl_command_queue  /* command_queue */,
//              cl_kernel         /* kernel */,
//              cl_uint           /* num_events_in_wait_list */,
//              const cl_event *  /* event_wait_list */,
//              cl_event *        /* event */) CL_API_SUFFIX__VERSION_1_0;
    enqueueTask: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.pointer,
            Signature.uint, bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(bridjs.NativeValue.pointer)).bind("clEnqueueTask"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueNativeKernel(cl_command_queue  /* command_queue */,
//					  void (CL_CALLBACK * /*user_func*/)(void *), 
//                      void *            /* args */,
//                      size_t            /* cb_args */, 
//                      cl_uint           /* num_mem_objects */,
//                      const cl_mem *    /* mem_list */,
//                      const void **     /* args_mem_loc */,
//                      cl_uint           /* num_events_in_wait_list */,
//                      const cl_event *  /* event_wait_list */,
//                      cl_event *        /* event */) CL_API_SUFFIX__VERSION_1_0;
    enqueueNativeKernel: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.pointer, bridjs.byPointer(Type.enqueueNativeKernelUserFunc),
            Signature.pointer, Signature.size, Signature.uint, Type.mem, bridjs.byPointer(bridjs.NativeValue.pointer), Signature.uint, bridjs.byPointer(bridjs.NativeValue.pointer),
            bridjs.byPointer(bridjs.NativeValue.pointer)).bind("clEnqueueNativeKernel")
});

Utils.extend(module.exports, ClBase);