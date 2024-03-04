import express from "express";
import multer from "multer";
import path from "path";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

export const router = express.Router();

// 1. connect firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSRn8TIk6T1bZ8fU2SfKPrtAWL0S5nYC4",
  authDomain: "uploadimage-project.firebaseapp.com",
  projectId: "uploadimage-project",
  storageBucket: "uploadimage-project.appspot.com",
  messagingSenderId: "85309393589",
  appId: "1:85309393589:web:dd7c8c68bb889a6bbe8cfc",
  measurementId: "G-W3EDV1C141",
};

initializeApp(firebaseConfig);
const storage = getStorage();

// upload to firebase
class FileMiddleware {
  filename = "";
  public readonly diskLoader = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 67108864, // 64 MByte
    },
  });
}

// PUT
const fileUpload = new FileMiddleware();
router.post("/", fileUpload.diskLoader.single("file"), async (req, res) => {
  let uid = req.query.id || "ImageProfileUser";
  if(uid != "ImageProfileUser"){
    uid = `User_${uid}`;
  }
  // 2. upload file to firebase storage
  // generate filename
  const filename = Date.now() + "-" + Math.round(Math.random() * 10000);

  // define saving filename on Storage
  const storageRef = ref(storage, "/images/" + uid + "/" + filename);
  
  // define detail
  const metadata = {
    contentType: req.file!.mimetype,
  };

  // upload to firebase storage
  const snapshot = await uploadBytesResumable(
    storageRef,
    req.file!.buffer,
    metadata
  );

  const url = await getDownloadURL(snapshot.ref);
  res.status(200).json({
    file: url,
    name: filename
  });
});

router.delete("/:name", async (req, res) => {
  let uid = req.query.id || "ImageProfileUser";
  let link = req.params.name
  if(uid != "ImageProfileUser"){
    uid = `User_${uid}`;
  }
  const stora = "gs://uploadimage-project.appspot.com";
  const filename = `${stora}/images/${uid}/${link}`
  
  const deleteref = ref(storage, filename);  

  deleteObject(deleteref).then(() => {
    res.status(200).json("Finish");
  }).catch((error) => {
    res.status(500).send("Error");
  })

})
