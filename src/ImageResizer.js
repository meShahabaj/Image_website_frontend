import { useState } from 'react';
import Header from './header';

const ImageResizer = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resizedURL, setResizedURL] = useState(null);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [ratio, setRatio] = useState(1);
  const [blur, setBlur] = useState(1);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img_url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        setRatio(img.width / img.height);
        setHeight(img.height);
        setWidth(img.width);
      };
      img.src = img_url;
      setImage(file);
      setPreview(img_url);
      setResizedURL(null); // reset old result
    }
  };

  const handleUpload = async () => {
    if (!image) return alert('No image selected');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('height', height);
    formData.append('width', width);
    formData.append("blur", blur);

    try {
      const response = await fetch('http://127.0.0.1:5000//upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResizedURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  const changeHeight = (e) => {
    const h = parseInt(e.target.value);
    setHeight(h);
    setWidth(Math.round(h * ratio));
  };

  const changeWidth = (e) => {
    const w = parseInt(e.target.value);
    setWidth(w);
    setHeight(Math.round(w / ratio));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Header />
      <div style={{ display: 'flex', flexDirection: 'column', padding: '15px', alignItems: 'center' }}>
        <h2>Upload and Resize Image</h2>

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '15px 0' }}>
          <label>Height</label>
          <input type="number" value={height} onChange={changeHeight} />
          <label>Width</label>
          <input type="number" value={width} onChange={changeWidth} />
          <label>Blur</label>
          <input type="number" value={blur} onChange={(e)=>{setBlur(e.target.value)}}/>
        </div>

        <button onClick={handleUpload} style={{ padding: '10px 20px', marginBottom: '20px' }}>
          Resize
        </button>

        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {preview && (
            <div>
              <h4>Original Preview:</h4>
              <img style={{ width: '200px' }} src={preview} alt="Original" />
            </div>
          )}

          {resizedURL && (
            <div>
              <h4>Resized Image:</h4>
              <img style={{ width: '200px' }} src={resizedURL} alt="Resized" />
              <br />
              <a href={resizedURL} download="resized_image.jpg">
                <button style={{
                  background: 'black',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  marginTop: '10px',
                  cursor: 'pointer'
                }}>
                  Download Resized Image
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageResizer;
