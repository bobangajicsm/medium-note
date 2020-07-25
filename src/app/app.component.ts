import { Component } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  localStorage: any;
  loading = true;

  constructor(
    public auth: AuthService,
    public router: Router,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.afAuth.auth.getRedirectResult().then((result) => {
      if (result.user) {
        this.router.navigate(["notes"]);
        this.auth.updateUserData(result.user);
      } else if (this.afAuth.auth.currentUser) {
        this.router.navigate(["notes"]);
      }
      this.loading = false;
    });
  }
}
