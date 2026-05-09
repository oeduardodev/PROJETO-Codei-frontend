import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import Typed from "typed.js";
import { MomentFormComponent } from "../../moment-form/moment-form.component";
import { MessageService } from "../../../services/message.service";
import { MomentService } from "../../../services/moment.service";

@Component({
  selector: "app-new-moment",
  standalone: true,
  templateUrl: "./new-moment.component.html",
  styleUrls: ["./new-moment.component.css"],
  imports: [MomentFormComponent],
})
export class NewMomentComponent implements OnInit, OnDestroy {
  btnText = "Compartilhar";
  typed?: Typed;

  constructor(
    private momentService: MomentService,
    private messageService: MessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.typed = new Typed(".typed-element", {
      strings: ["Código", "Pensamento", "Momento"],
      typeSpeed: 50,
      backSpeed: 90,
      showCursor: true,
      cursorChar: "|",
      loop: true,
    });
  }

  async createHandler(formData: FormData): Promise<void> {
    try {
      await firstValueFrom(this.momentService.createMoment(formData));
      this.messageService.addMessage("Momento adicionado com sucesso!");
      await this.router.navigate(["/"]);
    } catch {
      this.messageService.addMessage("Erro ao compartilhar o momento.");
    }
  }

  ngOnDestroy(): void {
    this.typed?.destroy();
  }
}
