
const {Router} = require('express')
const router = Router();

const admin = require('firebase-admin');
const {db} = require('../firebase-config');


// router.post('/api/new-proyect', async (req, res) => {
//     try {
//         const collectionRef = db.collection('proyect');

//         // Obtener todos los documentos ordenados por ID (convertido a ñúmero :3)
//         const snapshot = await collectionRef.orderBy('id', 'desc').limit(1).get();

//         // Calcular el próximo ID asi bien bonito y sabroso uwu
//         let nextId = 1; // Si no hay documentos, el ID inicial será 1 o eso se supone xd
//         if (!snapshot.empty) {
//             const lastDoc = snapshot.docs[0].data();
//             nextId = parseInt(lastDoc.id) + 1;
//         }

//         // Crear un nuevo documento con un ID único (y diferente)
//         const newDocRef = collectionRef.doc(nextId.toString());


//         // Guardar el documento con el nuevo ID alv
//         await newDocRef.set({
//             id: nextId, // Esta madre si mantiene la perr4 secuencia 1, 2, 3, 4
//             name: req.body.name,
//             description: req.body.description,
//             integrants: req.body.integrants,
//             degree: req.body.degree,
//         });

//         return res.status(201).json({ message: 'Tecnológico creado', id: nextId });
//     } catch (error) {
//         console.error('Error al crear el tecnológico:', error);
//         return res.status(500).send(error);
//     }
// });


router.post('/api/new-proyect', async (req, res) => {
    try {
        const { name, description, integrants, degree } = req.body;

        // Verificar si ya existe un proyecto con el mismo nombre
        const existingProyectSnapshot = await db.collection('proyect')
            .where('name', '==', name)
            .get();

        if (!existingProyectSnapshot.empty) {
            return res.status(400).json({ message: 'El nombre del proyecto ya existe. Por favor, elige otro.' });
        }

        const collectionRef = db.collection('proyect');

        // Obtener todos los documentos ordenados por ID
        const snapshot = await collectionRef.orderBy('id', 'desc').limit(1).get();

        // Calcular el próximo ID
        let nextId = 1; // Si no hay documentos, el ID inicial será 1
        if (!snapshot.empty) {
            const lastDoc = snapshot.docs[0].data();
            nextId = parseInt(lastDoc.id) + 1;
        }

        // Crear un nuevo documento con un ID único
        const newDocRef = collectionRef.doc(nextId.toString());

        // Guardar el documento con el nuevo ID
        await newDocRef.set({
            id: nextId,
            name,
            description,
            integrants,
            degree,
        });

        return res.status(201).json({ message: 'Proyecto creado exitosamente', id: nextId });
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        return res.status(500).send(error);
    }
});



//esta muestra todos los proyectos osiosi bien bonito apoco no viejon, fierro pariente osiosi ajua     <{:v     <--- es un pacman con sombrero
router.get('/api/proyects', async (req, res) => {
    try {
        const querySnapshot = await db.collection('proyect').get(); // Colección 'proyects' me quivoque era proyect y encontrar este pequeñisimo error me llevo una eternidad ni el pinch3 chatgpt lo encontro alv >:u
        const projects = querySnapshot.docs.map(doc => ({
            id: doc.id, // ID del documento
            ...doc.data(), // Datos del documento
        }));

        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found.' });
        }

        return res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



//una donde se retorne el doc que donde se encuentra el mismo "name"
router.get('/api/proyects/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const querySnapshot = await db.collection('proyect').where('name', '==', name).get();

        if (querySnapshot.empty) {
            return res.status(404).json({ message: `No project found with name: ${name}` });
        }

        // se supone que solo debe devolver el primer documento que coincide xd
        const projectDoc = querySnapshot.docs[0];
        const projectData = { id: projectDoc.id, ...projectDoc.data() };

        return res.status(200).json(projectData);
    } catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;






module.exports = router;