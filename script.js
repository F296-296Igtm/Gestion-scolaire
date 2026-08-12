import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuration de votre projet Firebase
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "gestion-scolaire-ac269.firebaseapp.com",
    projectId: "gestion-scolaire-ac269",
    storageBucket: "gestion-scolaire-ac269.appspot.com",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fonctions de navigation entre les onglets
function cacherToutesLesSections() {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
}

window.afficherAccueil = function() {
    cacherToutesLesSections();
    document.getElementById('sectionAccueil').style.display = 'block';
};

window.afficherEleves = function() {
    cacherToutesLesSections();
    document.getElementById('sectionEleves').style.display = 'block';
};

window.afficherEnseignants = function() {
    cacherToutesLesSections();
    document.getElementById('sectionEnseignants').style.display = 'block';
};

window.afficherClasses = function() {
    cacherToutesLesSections();
    document.getElementById('sectionClasses').style.display = 'block';
};

window.afficherMatieres = function() {
    cacherToutesLesSections();
    document.getElementById('sectionMatieres').style.display = 'block';
};

window.afficherNotes = function() {
    cacherToutesLesSections();
    document.getElementById('sectionNotes').style.display = 'block';
};

// Fonction pour ajouter un élève dans Firebase Firestore
window.ajouterEleve = async function() {
    const nom = document.getElementById("nomEleve").value.trim();
    const prenom = document.getElementById("prenomEleve").value.trim();
    const classe = document.getElementById("classeEleve").value.trim();

    if (!nom || !prenom || !classe) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    try {
        await addDoc(collection(db, "élève"), {
            Nom: nom,
            Prenom: prenom,
            Classe: classe
        });

        alert("Élève ajouté avec succès ! ✅");

        // Réinitialisation des champs du formulaire
        document.getElementById("nomEleve").value = "";
        document.getElementById("prenomEleve").value = "";
        document.getElementById("classeEleve").value = "";

    } catch (error) {
        console.error("Erreur Firebase : ", error);
        alert("Erreur lors de l'ajout de l'élève.");
    }
};
