// eslint-disable-next-line new-cap
const {Router} = require("express");
// eslint-disable-next-line new-cap
const router = Router();


const {db} = require("../firebase-config");


// Agregar nuevo evento

router.post("/api/new-event", async (req, res) => {
  try {
    await db.collection("events").doc("/" + req.body.id + "/").create(
        {name: req.body.name,
          description: req.body.description,
          date: req.body.date,
        });

    return res.json();
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Muestra de Eventos

router.get("/api/events", async (req, res)=>{
  try {
    const query = db.collection("events");
    const querySnapshot = await query.get();
    const docs = querySnapshot.docs;

    const response = docs.map((doc) =>({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      date: doc.data().date,
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Edicion de evento

router.put("/api/events/:event_id", async (req, res)=>{
  try {
    const document = db.collection("events").doc(req.params.event_id);
    document.update({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
    });
    return res.status(200).json();
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Borrar evento

router.delete("/api/delete-events/:event_id", async (req, res)=>{
  try {
    const document = db.collection("events").doc(req.params.event_id);
    document.delete();
    return res.status(200).json();
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
