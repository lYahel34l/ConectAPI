// eslint-disable-next-line new-cap
const {Router} = require("express");
// eslint-disable-next-line new-cap
const router = Router();


const {db} = require("../firebase-config");


// Agregar nuevo usuario de brujo

// router.post("/api/new-user", async (req, res) => {
//   try {
//     await db.collection("user").doc("/" + req.body.id + "/").create(
//         {
//           name: req.body.name,
//           email: req.body.email,
//           password: req.body.password,
//           degree: req.body.degree,
//           tec:req.body.tec,  //tec agregao
//         });

//     return res.json();
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// });


// agregar nuevo usuario del yahel
router.post("/api/new-user", async (req, res) => {
  try {
    // Obtener el valor del contador del ID
    const counterDoc = await db.collection("counters").doc("userId").get();

    if (!counterDoc.exists) {
      // Si no existe el documento, inicialízalo con 0
      await db.collection("counters").doc("userId").set({id: 1});
    }

    // Obtener el ID secuencial y actualizarlo
    const newUserId = counterDoc.data().id;

    // Verificar si el email ya existe
    const emailQuery = await db.collection("user")
        .where("email", "==", req.body.email).get();
    if (!emailQuery.empty) {
      return res.status(400)
          .json({error: "Email ya está registrado"});
    }

    // Crear el nuevo documento usando el ID secuencial como clave
    await db.collection("user").doc(String(newUserId)).set({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      degree: req.body.degree,
      tec: req.body.tec,
    });

    // Incrementar el contador para el siguiente ID
    await db.collection("counters").doc("userId").update({
      id: newUserId + 1,
    });

    return res.status(201).json(
        {message: "Usuario creado exitosamente",
          id: newUserId});
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});


// mostrar usuarios

router.get("/api/user", async (req, res) => {
  try {
    const query = db.collection("user");
    const querySnapshot = await query.get();
    const docs = querySnapshot.docs;

    const response = docs.map((doc) =>({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email,
      password: doc.data().password,
      degree: doc.data().degree,
      tec: doc.data().tec, // muestra tec (nuevo)
    }));
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
});


// ingresar usuario por login simple

router.post("/api/login", async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const usersRef = db.collection("user");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    let userData = null;
    snapshot.forEach((doc) => {
      userData = doc.data();
    });

    if (userData.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: snapshot.docs[0].id,
        email: userData.email,
        name: userData.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Eliminar usuario

router.delete("/api/delete-user/:user_id", async (req, res)=> {
  try {
    const document = db.collection("user").doc(req.params.user_id);
    document.delete();
    return res.status(200).json();
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Editar usuario

router.put("/api/user/:user_id", async (req, res)=> {
  try {
    const document = db.collection("user").doc(req.params.user_id);
    document.update({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(200).json();
  } catch (error) {
    return res.status(500).send(error);
  }
});


router.get("/api/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const userRef = db.collection("user").doc(userId);
    const doc = await userRef.get(); // Obtiene el documento

    if (!doc.exists) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User found",
      user: doc.data(), // Devuelve los datos del usuario
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});


module.exports = router;
