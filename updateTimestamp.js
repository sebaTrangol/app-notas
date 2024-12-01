import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import appFirebase from './credenciales.js';

const db = getFirestore(appFirebase);

async function updateTimestamps() {
    const notasRef = collection(db, 'notas');
    const querySnapshot = await getDocs(notasRef);

    querySnapshot.forEach(async (nota) => {
        const notaRef = doc(db, 'notas', nota.id);
        await updateDoc(notaRef, {
            timestamp: new Date() // Añade un nuevo timestamp basado en la hora actual
        });
        console.log(`Nota actualizada: ${nota.id}`);
    });
    console.log('Todos los documentos han sido actualizados.');
}

updateTimestamps().catch((error) => console.error('Error actualizando timestamps:', error));



