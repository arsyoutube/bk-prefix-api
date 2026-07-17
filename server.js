const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function fixPrefix(v) {
    if (!v) return v;

    return String(v)
        .replace(/सी\s*\/\s*ओ\s*/g, "C/O ")
        .replace(/स\s*ी\s*\/\s*ओ\s*/g, "C/O ")
        .replace(/स\s*\/\s*ो\s*/g, "C/O ")
        .replace(/स\/ो\s*/g, "C/O ")
        .replace(/देखरेख\s+/g, "C/O ")
        .replace(/देखभाल\s+/g, "C/O ")

        .replace(/व\s*\/\s*ो\s*/g, "W/O ")
        .replace(/व्?\s*\/\s*ओ\s*/g, "W/O ")
        .replace(/पत्नी\s+/g, "W/O ")

        .replace(/एस\s*\/\s*ओ\s*/g, "S/O ")
        .replace(/पुत्र\s+/g, "S/O ")

        .replace(/डी\s*\/\s*ओ\s*/g, "D/O ")
        .replace(/पुत्री\s+/g, "D/O ")

        .replace(/एच\s*\/\s*ओ\s*/g, "H/O ")
        .replace(/पति\s+/g, "H/O ")

        .replace(/\bW[\s\-]*\/[\s\-]*O\b/gi, "W/O")
        .replace(/\bS[\s\-]*\/[\s\-]*O\b/gi, "S/O")
        .replace(/\bD[\s\-]*\/[\s\-]*O\b/gi, "D/O")
        .replace(/\bC[\s\-]*\/[\s\-]*O\b/gi, "C/O")
        .replace(/\bH[\s\-]*\/[\s\-]*O\b/gi, "H/O");
}

function normalize(obj) {

    if (typeof obj === "string") {
        return fixPrefix(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(normalize);
    }

    if (obj && typeof obj === "object") {
        const out = {};
        for (const k in obj) {
            out[k] = normalize(obj[k]);
        }
        return out;
    }

    return obj;
}

// Home Page
app.get("/", (req, res) => {

    res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>BK Prefix API</title>

<style>

body{
font-family:Arial;
background:#111827;
color:white;
padding:40px;
}

textarea{
width:100%;
height:150px;
font-size:16px;
padding:10px;
}

button{
margin-top:10px;
padding:10px 20px;
font-size:18px;
cursor:pointer;
}

pre{
background:#222;
padding:15px;
margin-top:20px;
white-space:pre-wrap;
}

</style>

</head>

<body>

<h2>BK Prefix API Test</h2>

<textarea id="txt">
{
"house":"पुत्र राम कुमार",
"street":"पत्नी सीमा",
"landmark":"देखरेख मोहन"
}
</textarea>

<br>

<button onclick="send()">Normalize</button>

<pre id="out"></pre>

<script>

async function send(){

let json=document.getElementById("txt").value;

try{

let res=await fetch("/normalize",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:json

});

let data=await res.json();

document.getElementById("out").innerText=
JSON.stringify(data,null,4);

}catch(e){

document.getElementById("out").innerText=e;

}

}

</script>

</body>
</html>

`);

});

// API
app.post("/normalize",(req,res)=>{

const result=normalize(req.body);

res.json({

success:true,

data:result

});

});

// Browser Test
app.get("/test",(req,res)=>{

res.json(normalize({

house:"पुत्र राम कुमार",

street:"पत्नी सीमा",

landmark:"देखरेख मोहन",

locality:"पुत्री राधा"

}));

});

app.listen(PORT,()=>{

console.log("================================");

console.log("Server Running");

console.log("http://localhost:3000");

console.log("================================");

});