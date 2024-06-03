export default function validation(data){
    const error ={}

    const emailPattern= /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const passwordPattern= /^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,12}$/g;

    if(data.username === ""){
        error.username="* Name is Required!"
    }else if(data.username.length < 8){
        console.log(data.username.length)
        error.username="* Name must be atleast 6 characters"
    }

    if(data.email === ""){
        error.email ="* Email is Required"
    }
    else if(!emailPattern.test(data.email)){
        error.email="* Email did not match"
    }



    if(data.password === ""){
        error.password = "* Password is Required"
    }
    else if(!passwordPattern.test(data.password)){
        error.password="* Password not valid"
    }
    

    if(data.confirmpassword === ""){
        error.confirmpassword="* Confirm password is Required"
    }
    else if(data.password !== data.confirmpassword){
        error.confirmpassword ="* Confirm password did not match"
    }

    return error
}