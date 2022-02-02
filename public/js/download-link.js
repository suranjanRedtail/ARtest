    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
    import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-storage.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyDNVM-1n0Iw4mtpXFkr8uOeGmnrsfBqKWE",
      authDomain: "fresh-balancer-312208.firebaseapp.com",
      projectId: "fresh-balancer-312208",
      storageBucket: "fresh-balancer-312208.appspot.com",
      messagingSenderId: "619429345033",
      appId: "1:619429345033:web:56a8e4b03556927a2885d8",
      measurementId: "G-ZFQQDZ638E"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    async function downloadurl(filename) {
      const storageRef = ref(storage, "gs://fresh-balancer-312208.appspot.com/" + filename);
      var x = await getDownloadURL(storageRef);
      return x;
    }

    //searching query
    var search = new URLSearchParams(window.location.href.split('?')[1]);
    if (search.has("filename")) {
      //var filepath = "./assets/" + search.get("filename") + ".glb";
      var filename = search.get("filename") + ".glb";
      downloadurl(filename).then(value => setmodelviewerurl(value)).catch(error => console.log(error));
    }

    //checks if file exists, callback fucntions for onerror or success

    //sets model viewer source url
    function setmodelviewerurl(url) {
      $("#modelviewer").attr("src", url);
    }
