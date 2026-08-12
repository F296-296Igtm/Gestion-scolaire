

function cacherSections() {

    document.getElementById("sectionAccueil").style.display = "none";
    document.getElementById("sectionEleves").style.display = "none";
    document.getElementById("sectionEnseignants").style.display = "none";
    document.getElementById("sectionClasses").style.display = "none";
    document.getElementById("sectionMatieres").style.display = "none";
    document.getElementById("sectionNotes").style.display = "none";
}


function afficherAccueil() {

    cacherSections();

    document.getElementById("sectionAccueil").style.display = "block";

    mettreAJourStatistiques();
}


function afficherEleves() {

    cacherSections();

    document.getElementById("sectionEleves").style.display = "block";

    afficherElevesSauvegardes();
}


function ajouterEleve() {

    let nom = document.getElementById("nomEleve").value.trim();
    let prenom = document.getElementById("prenomEleve").value.trim();
    let classe = document.getElementById("classeEleve").value.trim();

    if (nom === "" || prenom === "" || classe === "") {

        alert("Veuillez remplir tous les champs.");

        return;
    }


    let eleves = JSON.parse(localStorage.getItem("eleves")) || [];


    eleves.push({

        nom: nom,
        prenom: prenom,
        classe: classe

    });


    localStorage.setItem(
        "eleves",
        JSON.stringify(eleves)
    );


    document.getElementById("nomEleve").value = "";
    document.getElementById("prenomEleve").value = "";
    document.getElementById("classeEleve").value = "";


    afficherElevesSauvegardes();

    mettreAJourStatistiques();
}


function afficherElevesSauvegardes() {

    let eleves =
        JSON.parse(localStorage.getItem("eleves")) || [];


    let tableau =
        document.getElementById("listeEleves");


    if (!tableau) return;


    tableau.innerHTML = "";


    eleves.forEach(function(eleve, index) {

        let ligne = tableau.insertRow();


        ligne.insertCell(0).textContent = index + 1;

        ligne.insertCell(1).textContent = eleve.nom;

        ligne.insertCell(2).textContent = eleve.prenom;

        ligne.insertCell(3).textContent = eleve.classe;


        let actions = ligne.insertCell(4);


        actions.innerHTML = `

            <button
                class="btn-modifier"
                onclick="modifierEleve(${index})">
                ✏️
            </button>

            <button
                class="btn-supprimer"
                onclick="supprimerEleve(${index})">
                🗑️
            </button>

        `;

    });
}


function modifierEleve(index) {

    let eleves =
        JSON.parse(localStorage.getItem("eleves")) || [];


    let eleve = eleves[index];


    let nom = prompt(
        "Modifier le nom :",
        eleve.nom
    );


    if (nom === null) return;


    let prenom = prompt(
        "Modifier le prénom :",
        eleve.prenom
    );


    if (prenom === null) return;


    let classe = prompt(
        "Modifier la classe :",
        eleve.classe
    );


    if (classe === null) return;


    if (
        nom.trim() === "" ||
        prenom.trim() === "" ||
        classe.trim() === ""
    ) {

        alert("Les champs ne peuvent pas être vides.");

        return;
    }


    eleves[index] = {

        nom: nom.trim(),

        prenom: prenom.trim(),

        classe: classe.trim()

    };


    localStorage.setItem(
        "eleves",
        JSON.stringify(eleves)
    );


    afficherElevesSauvegardes();

    mettreAJourStatistiques();
}


function supprimerEleve(index) {

    let eleves =
        JSON.parse(localStorage.getItem("eleves")) || [];


    if (
        confirm(
            "Voulez-vous vraiment supprimer cet élève ?"
        )
    ) {

        eleves.splice(index, 1);


        localStorage.setItem(
            "eleves",
            JSON.stringify(eleves)
        );


        afficherElevesSauvegardes();

        mettreAJourStatistiques();
    }
}


function viderEleves() {

    if (
        confirm(
            "Voulez-vous vraiment supprimer tous les élèves ?"
        )
    ) {

        localStorage.removeItem("eleves");

        afficherElevesSauvegardes();

        mettreAJourStatistiques();
    }
}


function afficherEnseignants() {

    cacherSections();

    document.getElementById("sectionEnseignants").style.display = "block";

    afficherEnseignantsSauvegardes();
}


function ajouterEnseignant() {

    let nom =
        document.getElementById("nomEnseignant").value.trim();

    let matiere =
        document.getElementById("matiereEnseignant").value.trim();


    if (nom === "" || matiere === "") {

        alert("Veuillez remplir tous les champs.");

        return;
    }


    let enseignants =
        JSON.parse(localStorage.getItem("enseignants")) || [];


    enseignants.push({

        nom: nom,

        matiere: matiere

    });


    localStorage.setItem(
        "enseignants",
        JSON.stringify(enseignants)
    );


    document.getElementById("nomEnseignant").value = "";

    document.getElementById("matiereEnseignant").value = "";


    afficherEnseignantsSauvegardes();

    mettreAJourStatistiques();
}


function afficherEnseignantsSauvegardes() {

    let enseignants =
        JSON.parse(localStorage.getItem("enseignants")) || [];


    let liste =
        document.getElementById("listeEnseignants");


    liste.innerHTML = "";


    enseignants.forEach(function(enseignant, index) {

        let li = document.createElement("li");


        li.innerHTML = `

            <span>
                👨‍🏫 ${enseignant.nom}
                — ${enseignant.matiere}
            </span>

            <button
                class="btn-supprimer"
                onclick="supprimerEnseignant(${index})">
                🗑️
            </button>

        `;


        liste.appendChild(li);

    });
}


function supprimerEnseignant(index) {

    let enseignants =
        JSON.parse(localStorage.getItem("enseignants")) || [];


    if (confirm("Supprimer cet enseignant ?")) {

        enseignants.splice(index, 1);


        localStorage.setItem(
            "enseignants",
            JSON.stringify(enseignants)
        );


        afficherEnseignantsSauvegardes();

        mettreAJourStatistiques();
    }
}


function afficherClasses() {

    cacherSections();

    document.getElementById("sectionClasses").style.display = "block";

    afficherClassesSauvegardees();
}


function ajouterClasse() {

    let nom =
        document.getElementById("nomClasse").value.trim();


    if (nom === "") {

        alert("Veuillez entrer une classe.");

        return;
    }


    let classes =
        JSON.parse(localStorage.getItem("classes")) || [];


    classes.push(nom);


    localStorage.setItem(
        "classes",
        JSON.stringify(classes)
    );


    document.getElementById("nomClasse").value = "";


    afficherClassesSauvegardees();

    mettreAJourStatistiques();
}


function afficherClassesSauvegardees() {

    let classes =
        JSON.parse(localStorage.getItem("classes")) || [];


    let liste =
        document.getElementById("listeClasses");


    liste.innerHTML = "";


    classes.forEach(function(classe, index) {

        let li = document.createElement("li");


        li.innerHTML = `

            <span>
                🏫 ${classe}
            </span>

            <button
                class="btn-supprimer"
                onclick="supprimerClasse(${index})">
                🗑️
            </button>

        `;


        liste.appendChild(li);

    });
}


function supprimerClasse(index) {

    let classes =
        JSON.parse(localStorage.getItem("classes")) || [];


    if (confirm("Supprimer cette classe ?")) {

        classes.splice(index, 1);


        localStorage.setItem(
            "classes",
            JSON.stringify(classes)
        );


        afficherClassesSauvegardees();

        mettreAJourStatistiques();
    }
}



function afficherMatieres() {

    cacherSections();

    document.getElementById("sectionMatieres").style.display = "block";

    afficherMatieresSauvegardees();
}


function ajouterMatiere() {

    let matiere =
        document.getElementById("nomMatiere").value.trim();


    if (matiere === "") {

        alert("Veuillez entrer une matière.");

        return;
    }


    let matieres =
        JSON.parse(localStorage.getItem("matieres")) || [];


    matieres.push(matiere);


    localStorage.setItem(
        "matieres",
        JSON.stringify(matieres)
    );


    document.getElementById("nomMatiere").value = "";


    afficherMatieresSauvegardees();

    mettreAJourStatistiques();
}


function afficherMatieresSauvegardees() {

    let matieres =
        JSON.parse(localStorage.getItem("matieres")) || [];


    let liste =
        document.getElementById("listeMatieres");


    liste.innerHTML = "";


    matieres.forEach(function(matiere, index) {

        let li = document.createElement("li");


        li.innerHTML = `

            <span>
                📚 ${matiere}
            </span>

            <button
                class="btn-supprimer"
                onclick="supprimerMatiere(${index})">
                🗑️
            </button>

        `;


        liste.appendChild(li);

    });
}


function supprimerMatiere(index) {

    let matieres =
        JSON.parse(localStorage.getItem("matieres")) || [];


    if (confirm("Supprimer cette matière ?")) {

        matieres.splice(index, 1);


        localStorage.setItem(
            "matieres",
            JSON.stringify(matieres)
        );


        afficherMatieresSauvegardees();

        mettreAJourStatistiques();
    }
}


function afficherNotes() {

    cacherSections();

    document.getElementById("sectionNotes").style.display = "block";

    afficherNotesSauvegardees();
}


function ajouterNote() {

    let eleve =
        document.getElementById("nomEleveNote").value.trim();


    let note =
        document.getElementById("noteEleve").value;


    if (eleve === "" || note === "") {

        alert("Veuillez remplir tous les champs.");

        return;
    }


    note = Number(note);


    if (note < 0 || note > 20) {

        alert("La note doit être comprise entre 0 et 20.");

        return;
    }


    let notes =
        JSON.parse(localStorage.getItem("notes")) || [];


    notes.push({

        eleve: eleve,

        note: note

    });


    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );


    document.getElementById("nomEleveNote").value = "";

    document.getElementById("noteEleve").value = "";


    afficherNotesSauvegardees();

    mettreAJourStatistiques();
}


function afficherNotesSauvegardees() {

    let notes =
        JSON.parse(localStorage.getItem("notes")) || [];


    let liste =
        document.getElementById("listeNotes");


    liste.innerHTML = "";


    notes.forEach(function(note, index) {

        let li = document.createElement("li");


        li.innerHTML = `

            <span>
                📝 ${note.eleve} : <strong>${note.note}/20</strong>
            </span>

            <button
                class="btn-supprimer"
                onclick="supprimerNote(${index})">
                🗑️
            </button>

        `;


        liste.appendChild(li);

    });
}


function supprimerNote(index) {

    let notes =
        JSON.parse(localStorage.getItem("notes")) || [];


    if (confirm("Supprimer cette note ?")) {

        notes.splice(index, 1);


        localStorage.setItem(
            "notes",
            JSON.stringify(notes)
        );


        afficherNotesSauvegardees();

        mettreAJourStatistiques();
    }
}


function mettreAJourStatistiques() {

    let eleves =
        JSON.parse(localStorage.getItem("eleves")) || [];


    let enseignants =
        JSON.parse(localStorage.getItem("enseignants")) || [];


    let classes =
        JSON.parse(localStorage.getItem("classes")) || [];


    let matieres =
        JSON.parse(localStorage.getItem("matieres")) || [];


    let notes =
        JSON.parse(localStorage.getItem("notes")) || [];


    document.getElementById("nombreEleves").textContent =
        eleves.length;


    document.getElementById("nombreEnseignants").textContent =
        enseignants.length;


    document.getElementById("nombreClasses").textContent =
        classes.length;


    document.getElementById("nombreMatieres").textContent =
        matieres.length;


    document.getElementById("nombreNotes").textContent =
        notes.length;
}


window.onload = function() {

    afficherAccueil();

    afficherElevesSauvegardes();

    afficherEnseignantsSauvegardes();

    afficherClassesSauvegardees();

    afficherMatieresSauvegardees();

    afficherNotesSauvegardees();

    mettreAJourStatistiques();

};
import { onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Écoute les changements dans Firebase et met à jour le tableau sur le site web
onSnapshot(collection(db, "élève"), (snapshot) => {
    const tableBody = document.getElementById("listeEleves");
    const totalEleves = document.getElementById("nombreEleves");
    
    if (tableBody) {
        tableBody.innerHTML = ""; // Vider le tableau HTML
        let index = 1;

        snapshot.forEach((doc) => {
            const eleve = doc.data();
            const row = `
                <tr>
                    <td>${index++}</td>
                    <td>${eleve.Nom || ''}</td>
                    <td>${eleve.Prenom || ''}</td>
                    <td>${eleve.Classe || ''}</td>
                    <td><button class="danger" onclick="supprimerEleve('${doc.id}')">🗑️</button></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    if (totalEleves) {
        totalEleves.textContent = snapshot.size; // Met à jour le compteur du tableau de bord
    }
});
