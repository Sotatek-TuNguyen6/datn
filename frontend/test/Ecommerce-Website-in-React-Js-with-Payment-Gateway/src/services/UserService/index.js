import axios from "axios"


export const createdUser = async (data) => {
    try {
        const postData = await axios.post("/api/v1/account", data)
        if(postData){
            return true;
        }
        else return false
    } catch (error) {
        console.log(error)
        return false
    }

}   