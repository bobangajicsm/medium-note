import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import MediumEditor from "medium-editor";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "src/app/auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { analytics } from 'firebase';

var MathJax: any;
@Component({
  selector: "app-note",
  templateUrl: "./note.component.html",
  styleUrls: ["./note.component.scss"],
})
export class NoteComponent implements OnInit {
  @ViewChild("medium", { static: true }) medium: ElementRef;
  @ViewChild("output", { static: true }) output: ElementRef;
  user;
  editor;
  note;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private auth: AuthService
  ) {}

  ngAfterViewInit() {
    const edit = this.medium.nativeElement;
    this.editor = new MediumEditor(edit);

    this.editor.subscribe("editableInput", (event, element: HTMLElement) => {
      this.note = this.editor.getContent();
      var mySubString = this.note.substring(
        this.note.indexOf("$") + 1, 
        this.note.lastIndexOf("$")
    );

    if(mySubString.length > 1) {
      this.convert(mySubString);
    }
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

  convert(input) {
    let out = this.output.nativeElement;
    out.innerHTML = '';
    //
    //  Reset the tex labels (and automatic equation numbers, though there aren't any here).
    //  Get the conversion options (metrics and display settings)
    //  Convert the input to CommonHTML output and use a promise to wait for it to be ready
    //    (in case an extension needs to be loaded dynamically).
    //
    window['MathJax'].texReset();
    var options = window['MathJax'].getMetricsFor(out);
    window['MathJax'].tex2chtmlPromise(input, options).then(function (node) {
      //
      //  The promise returns the typeset node, which we add to the output
      //  Then update the document to include the adjusted CSS for the
      //    content of the new equation.
      //
      out.appendChild(node);
      window['MathJax'].startup.document.clear();
      window['MathJax'].startup.document.updateDocument();
    }).catch(function (err) {
      //
      //  If there was an error, put the message into the output instead
      //
      console.log(err);
      out.appendChild(document.createElement('pre')).appendChild(document.createTextNode(err.message));
    }).then(function (e) {
      //
      //  Error or not, re-enable the display and render buttons
      //
    });
  }

  ngOnInit() {
    this.user = this.afAuth.auth.currentUser;
    this.getNotes();
  }
}
