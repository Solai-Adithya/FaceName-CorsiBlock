import React from "react";
import logo from "./logo.svg";
import "./App.css";
// import imgsrc from "./assets/female/3.jpeg";

function showImagesAlone(props) {
	console.log(props);
	return (
		<div>
			<img src={props.imgsrc} alt="face" />
		</div>
	);
}

function showImageWithText(props) {
	return (
		<div>
			<img src={props.image} alt="face" />
			<p>{props.text}</p>
		</div>
	);
}

// function showImagesWithAllText(props) {
// 	return 
// }

function App() {
  const [msg, setMsg] = React.useState(null);
//   const [faces, setFaces] = React.useState(null);
//   const [face, setFace] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setMsg(data.message));
  }, []);

//   React.useEffect(() => {
// 	fetch("/facename/get_faces", {limit: 4})
// 	  .then((res) => res.json())
// 	  .then((data) => setFaces(data.message));
//   }, []);

//   React.useEffect(() => {
// 	fetch("/facename/get_one_face", {face_id: 4})
// 	  .then((res) => res.json())
// 	  .then((data) => setFace(data.imgsrc));
//   }, [face]);

//   const imgsrc = "./assets/female/4.jpeg";

//   return (
//     <div className="App">
//       <header className="App-header">
//         {/* <img src={logo} className="App-logo" alt="logo" /> */}
// 		{/* {showImagesAlone(face)} */}
// 		{console.log("Face: ", face)}
// 		{/* <img src={face.imgsrc} alt="face" /> */}
// 		{/* show the image in the directory /assets/female/3.jpeg */}

// 		<img src={require('./assets/female/3.jpeg')} alt="face" />
// 		<p>{!msg ? "Loading..." : msg}</p>
//       </header>
//     </div>
//   );

  //return a component with the image in the center in location assets/female/3.jpeg
  
}


export default App;