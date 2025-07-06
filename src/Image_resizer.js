import { useState } from 'react';
import Header from './header';

const Image_resizer = () => {
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
      img.onload = () => {
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
      const response = await fetch('http://127.0.0.1:5000//upload', {
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

  const changeHeight = (e) => {
    setHeight(e.target.value);
    setWidth(e.target.value * ratio);
  }

  const changeWidth = (e) => {
    setWidth(e.target.value);
    setHeight(e.target.value / ratio);
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Header />
      <div style={{ display: "flex", flexDirection: "column", padding: "1px 15px", display: "flex", alignItems: "center" }}>
        <h2 style={{ alignItems: "center", display: "flex", justifyContent: "center" }}>Upload and Resize Image</h2>

        <input style={{ alignItems: "center", display: "flex", justifyContent: "center" }} type="file" accept="image/*" onChange={handleFileChange} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>Height</p>
          <input type="number" value={height} onChange={changeHeight} />
          <p>Width</p>
          <input type="number" value={width} onChange={changeWidth} />
        </div>

        <button onClick={handleUpload}>Resize</button>

        <div style={{ display: "flex" }}>
          {preview && (
            <div style={{ flex: 1 }}>
              <h4>Original Preview:</h4>
              <img style={{ width: "50%" }} src={preview} alt="Original" />
            </div>
          )}

          {resizedURL && (<>
            <div style={{ flex: 1 }}>
              <h4>Resized Image:</h4>
              <img style={{ width: "50%" }} src={resizedURL} alt="Resized" />


            </div>
            <a href={resizedURL} download="resized_image.jpg">
              <button style={{ color: "white", background: "Black", padding: "10px" }}>Download Resized Image</button>
            </a></>
          )}
        </div>

      </div>

    </div>
  );
}

export default Image_resizer;
