// hash.js
const bcrypt = require('bcryptjs'); // Usa solo bcryptjs (más compatible)

// Generar hash para Elizabeth (asincrónico)
bcrypt.hash("eellaguno@scl.edu.gt", 10, (err, hashElizabeth) => {
    if (err) console.error("Error:", err);
    else console.log("Hash Elizabeth:", hashElizabeth);
});

// Generar hash para Jonhy (sincrónico)
const hashJonhy = bcrypt.hashSync("jsaragon@scl.edu.gt", 10);
console.log("Hash Jonhy:", hashJonhy);

// Generar hash para Jossue (opcional)
const hashJossue = bcrypt.hashSync("jefuentes@scl.edu.gt", 10);
console.log("Hash Jossue:", hashJossue);