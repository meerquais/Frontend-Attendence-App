import axios from "axios";


const uploadImage = async (imageFile) => {
  try {

    const formData = new FormData();
    formData.append("image", imageFile);
   
    const response = await axios.post(
      "http://localhost:5000/api/v1/uploadimage",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data.secure_url;
  } catch (err) {
    return err.message;
  }
};


export default uploadImage