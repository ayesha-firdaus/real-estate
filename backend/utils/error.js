exports.errorHanlder=(statusCode,message)=>{
    const error=new Error();
    error.statusCode=statusCode;
    error.message=message;
    console.log(error)
    return error;
};