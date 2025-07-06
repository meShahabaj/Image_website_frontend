import  { useState } from 'react';
import styles from "./Image_resizer.module.css";


const Image_resizer = ()=> {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); 
  const [resizedURL, setResizedURL] = useState(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [ratio, setRatio] = useState(1);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img_url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = ()=>{
        setRatio(img.width / img.height)
        setHeight(img.height)
        setWidth(img.width)
      }
      img.src = img_url;
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResizedURL(null); // reset old result
    }
  };

  const handleUpload = async () => {
    if (!image) return alert('No image selected');

    const formData = new FormData();
    formData.append('image', image);
    formData.append("height", height);
    formData.append("width", width);

    try {
      const response = await fetch('https://image-website-backend.onrender.com//upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResizedURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  const changeHeight=(e)=>{
    setHeight(e.target.value);
    setWidth(e.target.value * ratio);
  }

  const changeWidth=(e)=>{
    setWidth(e.target.value);
    setHeight(e.target.value / ratio);
  }

  return (
    <div className={styles.container}>
        <h2>Upload and Resize Image</h2>

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <div className={styles.inputRow}>
            <p>Height</p>
            <input type="number" value={height} onChange={changeHeight} />
            <p>Width</p>
            <input type="number" value={width} onChange={changeWidth} />
        </div>

        <button onClick={handleUpload}>Upload and Resize</button>

        <div className={styles.preview}>{preview && (
            <div>
            <h4>Original Preview:</h4>
            <img src={preview} alt="Original" className={styles.previewImg} />
            </div>
        )}

        {resizedURL && (
            <div className={styles.result}>
            <h4>Resized Image:</h4>
            <img src={resizedURL} alt="Resized"  />
            
            </div>
        )}
        </div>
        <a href={resizedURL} download="resized_image.jpg">
                <button>Download Resized Image</button>
            </a>
        </div>

  );
}

export default Image_resizer;
