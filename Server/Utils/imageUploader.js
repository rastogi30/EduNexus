const cloudinary = require('cloudinary').v2


// not upload only image upload video alos since file pass kari h to file kuch bhi so sakti h
exports.uploadImageToCloudinary = async (file, folder,height, quality) => {
    const options={folder}
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality=quality;         
    }
    options.resource_type="auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);

} 