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
    cl10 = require("./cl_1_0"), lib;

lib = my.Class(cl10, {
    STATIC: {
        getVersion: function () {
            return 1.1;
        }
    },
//extern CL_API_ENTRY cl_mem CL_API_CALL
//clCreateSubBuffer(cl_mem                   /* buffer */,
//                  cl_mem_flags             /* flags */,
//                  cl_buffer_create_type    /* buffer_create_type */,
//                  const void *             /* buffer_create_info */,
//                  cl_int *                 /* errcode_ret */) CL_API_SUFFIX__VERSION_1_1;
    createSubBuffer: bridjs.defineFunction(Type.mem, Type.mem, Signature.pointer, Type.memFlags, Type.bufferCreateType,
        Signature.pointer, Signature.pointer, bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateSubBuffer"),
//extern CL_API_ENTRY cl_int CL_API_CALL
//clSetMemObjectDestructorCallback(  cl_mem /* memobj */, 
//                                    void (CL_CALLBACK * /*pfn_notify*/)( cl_mem /* memobj */, void* /*user_data*/), 
//                                    void * /*user_data */ )             CL_API_SUFFIX__VERSION_1_1;  
//extern CL_API_ENTRY cl_int CL_API_CALL
//clSetUserEventStatus(cl_event   /* event */,
    //                    cl_int     /* execution_status */) CL_API_SUFFIX__VERSION_1_1;
    setUserEventStatus: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.int).bind("clSetUserEventStatus"),

//extern CL_API_ENTRY cl_int CL_API_CALL
//clSetEventCallback( cl_event    /* event */,
//                    cl_int      /* command_exec_callback_type */,
//                    void (CL_CALLBACK * /* pfn_notify */)(cl_event, cl_int, void *),
//                    void *      /* user_data */) CL_API_SUFFIX__VERSION_1_1;

    setEventCallback: bridjs.defineFunction(Signature.int, Signature.pointer, Signature.int, bridjs.byPointer(Type.setEventCallbackCallback),
        Signature.pointer).bind("clSetEventCallback"),

//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueReadBufferRect(cl_command_queue    /* command_queue */,
//                        cl_mem              /* buffer */,
//                        cl_bool             /* blocking_read */,
//                        const size_t *      /* buffer_offset */,
//                        const size_t *      /* host_offset */, 
//                        const size_t *      /* region */,
//                        size_t              /* buffer_row_pitch */,
//                        size_t              /* buffer_slice_pitch */,
//                        size_t              /* host_row_pitch */,
//                        size_t              /* host_slice_pitch */,                        
//                        void *              /* ptr */,
//                        cl_uint             /* num_events_in_wait_list */,
//                        const cl_event *    /* event_wait_list */,
//                        cl_event *          /* event */) CL_API_SUFFIX__VERSION_1_1;

    enqueueReadBufferRect: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Signature.bool,
        bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.size), Signature.size, Signature.size, Signature.size, Signature.size,
        Signature.pointer, Signature.uint, bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(bridjs.NativeValue.pointer)).bind("clEnqueueReadBufferRect"),

//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueWriteBufferRect(cl_command_queue    /* command_queue */,
//                         cl_mem              /* buffer */,
//                         cl_bool             /* blocking_write */,
//                         const size_t *      /* buffer_offset */,
//                         const size_t *      /* host_offset */, 
//                         const size_t *      /* region */,
//                         size_t              /* buffer_row_pitch */,
//                         size_t              /* buffer_slice_pitch */,
//                         size_t              /* host_row_pitch */,
//                         size_t              /* host_slice_pitch */,                        
//                         const void *        /* ptr */,
//                         cl_uint             /* num_events_in_wait_list */,
//                         const cl_event *    /* event_wait_list */,
//                         cl_event *          /* event */) CL_API_SUFFIX__VERSION_1_1;

    enqueueWriteBufferRect: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Signature.bool,
        bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.size), Signature.size, Signature.size, Signature.size, Signature.size,
        Signature.pointer, Signature.uint, bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(bridjs.NativeValue.pointer)).bind("clEnqueueWriteBufferRect"),


//extern CL_API_ENTRY cl_int CL_API_CALL
//clEnqueueCopyBufferRect(cl_command_queue    /* command_queue */, 
//                        cl_mem              /* src_buffer */,
//                        cl_mem              /* dst_buffer */, 
//                        const size_t *      /* src_origin */,
//                        const size_t *      /* dst_origin */,
//                        const size_t *      /* region */, 
//                        size_t              /* src_row_pitch */,
//                        size_t              /* src_slice_pitch */,
//                        size_t              /* dst_row_pitch */,
//                        size_t              /* dst_slice_pitch */,
//                        cl_uint             /* num_events_in_wait_list */,
//                        const cl_event *    /* event_wait_list */,
//                        cl_event *          /* event */) CL_API_SUFFIX__VERSION_1_1;  

    enqueueCopyBufferRect: bridjs.defineFunction(Signature.int, Signature.pointer, Type.mem, Type.mem,
        bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.size), bridjs.byPointer(bridjs.NativeValue.size), Signature.size, Signature.size, Signature.size, Signature.size,
        Signature.uint, bridjs.byPointer(bridjs.NativeValue.pointer), bridjs.byPointer(bridjs.NativeValue.pointer)).bind("clEnqueueCopyBufferRect"),
    //extern CL_API_ENTRY cl_event CL_API_CALL
//clCreateUserEvent(cl_context    /* context */,
    //                 cl_int *      /* errcode_ret */) CL_API_SUFFIX__VERSION_1_1;
    createUserEvent: bridjs.defineFunction(Signature.pointer,
        bridjs.byPointer(bridjs.NativeValue.int)).bind("clCreateUserEvent")
});

Utils.extend(lib, cl10);

module.exports = lib;
