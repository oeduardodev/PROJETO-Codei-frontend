import { CommonModule } from "@angular/common";
import { Component, computed } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { NgxTypedJsModule } from "ngx-typed-js";
import { RouterLink } from "@angular/router";
import { LoadingComponent } from "../../../loading/loading.component";
import { ImageFallbackDirective } from "../../../directives/image-fallback.directive";
import { MomentService } from "../../../services/moment.service";
import { SearchService } from "../../../services/search.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    RouterLink,
    NgxTypedJsModule,
    LoadingComponent,
    ImageFallbackDirective,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  readonly faSearch = faSearch;
  readonly moments = this.searchService.filteredMoments;
  readonly hasMoments = computed(() => this.moments().length > 0);

  constructor(
    private momentService: MomentService,
    private searchService: SearchService,
  ) {
    this.loadMoments();
  }

  private loadMoments(): void {
    this.momentService.getMoments().subscribe((items) => {
      const data = items.data.map((item) => ({
        ...item,
        created_at: new Date(item.created_at!).toLocaleDateString("pt-BR"),
      }));

      this.searchService.setFilteredMoments(data);
    });
  }
}
