import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "AIzaSyAC5XlcpnhduauHiN9u-ML7fEBkSuHKAkg",

    authDomain:
        "gestion-scolaire-ac269.firebaseapp.com",

    projectId:
        "gestion-scolaire-ac269",

    storageBucket:
        "gestion-scolaire-ac269.firebasestorage.app",

    messagingSenderId:
        "237667733638",

    appId:
        "1:237667733638:web:70a38ef93403fc718bc107"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


// ==============================
// CACHER LES SECTIONS
// ==============================

function cacherSections() {

    document.getElementById("sectionAccueil").style.display = "none";

    document.getElementById("sectionEleves").style.display = "none";

    document.getElementById("sectionEnseignants").style.display = "none";

    document.getElementById("sectionClasses").style.display = "none";

    document.getElementById("sectionMatieres").style.display = "none";

    document.getElementById("sectionNotes").style.display = "none";
}


// ==============================
// ACCUEIL
// ==============================

function afficherAccueil() {

    cacherSections();

    document.getElementById("sectionAccueil").style.display = "block";

    mettreAJourStatistiques();
}


// ==============================
// ÉLÈVES
// ==============================

async function afficherEleves() {

    cacherSections();

    document.getElementById("sectionEleves").style.display = "block";

    await afficherElevesSauvegardes();
}


// ==============================
// AJOUTER ÉLÈVE
// ==============================

async function ajouterEleve() {

    const nom =
        document.getElementById("nomEleve").value.trim();

    const prenom =
        document.getElementById("prenomEleve").value.trim();

    const classe =
        document.getElementById("classeEleve").value.trim();


    if (
        nom === "" ||
        prenom === "" ||
        classe === ""
    ) {

        alert("Veuillez remplir tous les champs.");

        return;
    }


    try {

        await addDoc(
            collection(db, "eleves"),
            {
                nom: nom,
                prenom: prenom,
                classe: classe,
                dateAjout: new Date()
            }
        );


        alert("Élève ajouté avec succès !");


        document.getElementById("nomEleve").value = "";

        document.getElementById("prenomEleve").value = "";

        document.getElementById("classeEleve").value = "";


        await afficherElevesSauvegardes();

        await mettreAJourStatistiques();

    }

    catch (erreur) {

        console.error(erreur);

        alert(
            "Impossible d'enregistrer l'élève."
        );
    }
}


// ==============================
// AFFICHER ÉLÈVES
// ==============================

async function afficherElevesSauvegardes() {

    const tableau =
        document.getElementById("listeEleves");


    tableau.innerHTML = "";


    try {

        const resultat =
            await getDocs(
                collection(db, "eleves")
            );


        let numero = 1;


        resultat.forEach(
            function(documentFirebase) {

                const eleve =
                    documentFirebase.data();


                const ligne =
                    tableau.insertRow();


                ligne.insertCell(0)
                    .textContent = numero;


                ligne.insertCell(1)
                    .textContent =
                    eleve.nom || "";


                ligne.insertCell(2)
                    .textContent =
                    eleve.prenom || "";


                ligne.insertCell(3)
                    .textContent =
                    eleve.classe || "";


                const action =
                    ligne.insertCell(4);


                action.innerHTML = `

                    <button
                        onclick="supprimerEleve('${documentFirebase.id}')">

                        🗑️ Supprimer

                    </button>

                `;


                numero++;
            }
        );

    }

    catch (erreur) {

        console.error(erreur);

        console.log(
            "Firebase n'est pas encore accessible."
        );
    }
}


// ==============================
// SUPPRIMER ÉLÈVE
// ==============================

async function supprimerEleve(id) {

    if (
        !confirm(
            "Voulez-vous supprimer cet élève ?"
        )
    ) {

        return;
    }


    try {

        await deleteDoc(
            doc(db, "eleves", id)
        );


        await afficherElevesSauvegardes();

        await mettreAJourStatistiques();

    }

    catch (erreur) {

        console.error(erreur);

        alert(
            "Impossible de supprimer l'élève."
        );
    }
}


// ==============================
// ENSEIGNANTS
// ==============================

function afficherEnseignants() {

    cacherSections();

    document.getElementById(
        "sectionEnseignants"
    ).style.display = "block";

    afficherEnseignantsSauvegardes();
}


function ajouterEnseignant() {

    const nom =
        document.getElementById(
            "nomEnseignant"
        ).value.trim();


    const matiere =
        document.getElementById(
            "matiereEnseignant"
        ).value.trim();


    if (
        nom === "" ||
        matiere === ""
    ) {

        alert(
            "Veuillez remplir tous les champs."
        );

        return;
    }


    const enseignants =
        JSON.parse(
            localStorage.getItem(
                "enseignants"
            )
        ) || [];


    enseignants.push({
        nom: nom,
        matiere: matiere
    });


    localStorage.setItem(
        "enseignants",
        JSON.stringify(enseignants)
    );


    document.getElementById(
        "nomEnseignant"
    ).value = "";


    document.getElementById(
        "matiereEnseignant"
    ).value = "";


    afficherEnseignantsSauvegardes();

    mettreAJourStatistiques();
}


function afficherEnseignantsSauvegardes() {

    const enseignants =
        JSON.parse(
            localStorage.getItem(
                "enseignants"
            )
        ) || [];


    const liste =
        document.getElementById(
            "listeEnseignants"
        );


    liste.innerHTML = "";


    enseignants.forEach(
        function(enseignant, index) {

            const li =
                document.createElement("li");


            li.innerHTML = `

                👨‍🏫 ${enseignant.nom}
                — ${enseignant.matiere}

                <button
                    onclick="supprimerEnseignant(${index})">

                    🗑️

                </button>

            `;


            liste.appendChild(li);
        }
    );
}


function supprimerEnseignant(index) {

    const enseignants =
        JSON.parse(
            localStorage.getItem(
                "enseignants"
            )
        ) || [];


    enseignants.splice(index, 1);


    localStorage.setItem(
        "enseignants",
        JSON.stringify(enseignants)
    );


    afficherEnseignantsSauvegardes();

    mettreAJourStatistiques();
}


// ==============================
// CLASSES
// ==============================

function afficherClasses() {

    cacherSections();

    document.getElementById(
        "sectionClasses"
    ).style.display = "block";

    afficherClassesSauvegardees();
}


function ajouterClasse() {

    const nom =
        document.getElementById(
            "nomClasse"
        ).value.trim();


    if (nom === "") {

        alert(
            "Veuillez entrer une classe."
        );

        return;
    }


    const classes =
        JSON.parse(
            localStorage.getItem("classes")
        ) || [];


    classes.push(nom);


    localStorage.setItem(
        "classes",
        JSON.stringify(classes)
    );


    document.getElementById(
        "nomClasse"
    ).value = "";


    afficherClassesSauvegardees();

    mettreAJourStatistiques();
}


function afficherClassesSauvegardees() {

    const classes =
        JSON.parse(
            localStorage.getItem("classes")
        ) || [];


    const liste =
        document.getElementById(
            "listeClasses"
        );


    liste.innerHTML = "";


    classes.forEach(
        function(classe, index) {

            const li =
                document.createElement("li");


            li.innerHTML = `

                🏫 ${classe}

                <button
                    onclick="supprimerClasse(${index})">

                    🗑️

                </button>

            `;


            liste.appendChild(li);
        }
    );
}


function supprimerClasse(index) {

    const classes =
        JSON.parse(
            localStorage.getItem("classes")
        ) || [];


    classes.splice(index, 1);


    localStorage.setItem(
        "classes",
        JSON.stringify(classes)
    );


    afficherClassesSauvegardees();

    mettreAJourStatistiques();
}


// ==============================
// MATIÈRES
// ==============================

function afficherMatieres() {

    cacherSections();

    document.getElementById(
        "sectionMatieres"
    ).style.display = "block";

    afficherMatieresSauvegardees();
}


function ajouterMatiere() {

    const matiere =
        document.getElementById(
            "nomMatiere"
        ).value.trim();


    if (matiere === "") {

        alert(
            "Veuillez entrer une matière."
        );

        return;
    }


    const matieres =
        JSON.parse(
            localStorage.getItem("matieres")
        ) || [];


    matieres.push(matiere);


    localStorage.setItem(
        "matieres",
        JSON.stringify(matieres)
    );


    document.getElementById(
        "nomMatiere"
    ).value = "";


    afficherMatieresSauvegardees();

    mettreAJourStatistiques();
}


function afficherMatieresSauvegardees() {

    const matieres =
        JSON.parse(
            localStorage.getItem("matieres")
        ) || [];


    const liste =
        document.getElementById(
            "listeMatieres"
        );


    liste.innerHTML = "";


    matieres.forEach(
        function(matiere, index) {

            const li =
                document.createElement("li");


            li.innerHTML = `

                📚 ${matiere}

                <button
                    onclick="supprimerMatiere(${index})">

                    🗑️

                </button>

            `;


            liste.appendChild(li);
        }
    );
}


function supprimerMatiere(index) {

    const matieres =
        JSON.parse(
            localStorage.getItem("matieres")
        ) || [];


    matieres.splice(index, 1);


    localStorage.setItem(
        "matieres",
        JSON.stringify(matieres)
    );


    afficherMatieresSauvegardees();

    mettreAJourStatistiques();
}


// ==============================
// NOTES
// ==============================

function afficherNotes() {

    cacherSections();

    document.getElementById(
        "sectionNotes"
    ).style.display = "block";

    afficherNotesSauvegardees();
}


function ajouterNote() {

    const eleve =
        document.getElementById(
            "nomEleveNote"
        ).value.trim();


    let note =
        document.getElementById(
            "noteEleve"
        ).value;


    if (
        eleve === "" ||
        note === ""
    ) {

        alert(
            "Veuillez remplir tous les champs."
        );

        return;
    }


    note = Number(note);


    if (
        note < 0 ||
        note > 20
    ) {

        alert(
            "La note doit être entre 0 et 20."
        );

        return;
    }


    const notes =
        JSON.parse(
            localStorage.getItem("notes")
        ) || [];


    notes.push({
        eleve: eleve,
        note: note
    });


    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );


    document.getElementById(
        "nomEleveNote"
    ).value = "";


    document.getElementById(
        "noteEleve"
    ).value = "";


    afficherNotesSauvegardees();

    mettreAJourStatistiques();
}


function afficherNotesSauvegardees() {

    const notes =
        JSON.parse(
            localStorage.getItem("notes")
        ) || [];


    const liste =
        document.getElementById(
            "listeNotes"
        );


    liste.innerHTML = "";


    notes.forEach(
        function(note, index) {

            const li =
                document.createElement("li");


            li.innerHTML = `

                📝 ${note.eleve} :
                ${note.note}/20

                <button
                    onclick="supprimerNote(${index})">

                    🗑️

                </button>

            `;


            liste.appendChild(li);
        }
    );
}


function supprimerNote(index) {

    const notes =
        JSON.parse(
            localStorage.getItem("notes")
        ) || [];


    notes.splice(index, 1);


    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );


    afficherNotesSauvegardees();

    mettreAJourStatistiques();
}


// ==============================
// STATISTIQUES
// ==============================

async function mettreAJourStatistiques() {

    let nombreEleves = 0;


    try {

        const resultat =
            await getDocs(
                collection(db, "eleves")
            );

        nombreEleves =
            resultat.size;

    }

    catch (erreur) {

        console.error(erreur);
    }


    const enseignants =
        JSON.parse(
            localStorage.getItem(
                "enseignants"
            )
        ) || [];


    const classes =
        JSON.parse(
            localStorage.getItem(
                "classes"
            )
        ) || [];


    const matieres =
        JSON.parse(
            localStorage.getItem(
                "matieres"
            )
        ) || [];


    const notes =
        JSON.parse(
            localStorage.getItem(
                "notes"
            )
        ) || [];


    document.getElementById(
        "nombreEleves"
    ).textContent =
        nombreEleves;


    document.getElementById(
        "nombreEnseignants"
    ).textContent =
        enseignants.length;


    document.getElementById(
        "nombreClasses"
    ).textContent =
        classes.length;


    document.getElementById(
        "nombreMatieres"
    ).textContent =
        matieres.length;


    document.getElementById(
        "nombreNotes"
    ).textContent =
        notes.length;
}


// ==============================
// RENDRE LES FONCTIONS
// ACCESSIBLES AUX BOUTONS
// ==============================

window.afficherAccueil =
    afficherAccueil;

window.afficherEleves =
    afficherEleves;

window.ajouterEleve =
    ajouterEleve;

window.supprimerEleve =
    supprimerEleve;

window.afficherEnseignants =
    afficherEnseignants;

window.ajouterEnseignant =
    ajouterEnseignant;

window.supprimerEnseignant =
    supprimerEnseignant;

window.afficherClasses =
    afficherClasses;

window.ajouterClasse =
    ajouterClasse;

window.supprimerClasse =
    supprimerClasse;

window.afficherMatieres =
    afficherMatieres;

window.ajouterMatiere =
    ajouterMatiere;

window.supprimerMatiere =
    supprimerMatiere;

window.afficherNotes =
    afficherNotes;

window.ajouterNote =
    ajouterNote;

window.supprimerNote =
    supprimerNote;


// ==============================
// DÉMARRAGE
// ==============================

window.addEventListener(
    "load",
    function() {

        afficherAccueil();

        afficherElevesSauvegardes();

        afficherEnseignantsSauvegardes();

        afficherClassesSauvegardees();

        afficherMatieresSauvegardees();

        afficherNotesSauvegardees();

        mettreAJourStatistiques();
    }
