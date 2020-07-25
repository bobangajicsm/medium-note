import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import MediumEditor from "medium-editor";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "src/app/auth.service";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-note",
  templateUrl: "./note.component.html",
  styleUrls: ["./note.component.scss"],
})
export class NoteComponent implements OnInit {
  @ViewChild("medium", { static: true }) medium: ElementRef;
  user;
  editor;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private auth: AuthService
  ) {}

  ngAfterViewInit() {
    const edit = this.medium.nativeElement;
    this.editor = new MediumEditor(edit);

    this.editor.subscribe("editableInput", (event, element: HTMLElement) => {
      this.updateNote(this.editor.getContent());
    });
  }

  updateNote(note) {
    this.auth.updateNote(note, this.user.uid);
  }

  getNotes() {
    try {
      this.firestore
        .collection("users")
        .doc(this.user.uid)
        .ref.get()
        .then((doc) => {
          const note = doc.data().note;
          this.editor.setContent( note || '');
        });
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit() {
    this.user = this.afAuth.auth.currentUser;
    this.getNotes();
  }
}
