import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewChecked,
  ViewChild,
  ElementRef
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { FeatureCollection } from "geojson";

import { GncProgramsService } from "../../api/gnc-programs.service";
import { Program } from "../programs.models";
// import { Observation } from "./observation.model";
import { ModalFlowService } from "./modalflow/modalflow.service";

@Component({
  selector: "app-observations",
  templateUrl: "./obs.component.html",
  styleUrls: ["./obs.component.css", "../../home/home.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class ObsComponent implements OnInit, AfterViewChecked {
  title = "Observations";
  fragment: string;
  program_id: any;
  coords: any;
  programs: Program[];
  program: Program;
  observations: FeatureCollection;
  programFeature: FeatureCollection;
  surveySpecies: any[];

  constructor(
    private route: ActivatedRoute,
    private programService: GncProgramsService,
    public flowService: ModalFlowService
  ) {
    this.route.params.subscribe(params => (this.program_id = params["id"]));
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data: { programs: Program[] }) => {
      // TODO: merge observables
      this.programs = data.programs;
      this.program = this.programs.find(p => p.id_program == this.program_id);
      this.programService
        .getProgramObservations(this.program_id)
        .subscribe(observations => {
          this.observations = observations;
        });
      this.programService
        .getProgramTaxonomyList(this.program_id)
        .subscribe(taxa => {
          this.surveySpecies = taxa;
        });
      this.programService
        .getProgram(this.program_id)
        .subscribe(program => (this.programFeature = program));
    });
  }

  ngAfterViewChecked(): void {
    try {
      if (this.fragment) {
        document
          .querySelector("#" + this.fragment)
          .scrollIntoView({ behavior: "smooth" });
      }
    } catch (e) {
      alert(e);
    }
  }
}
