import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'englishVerb';
  private dragged!: any;
  @ViewChild('drag') drag!: ElementRef;
  verbs: string[] = ['swim', 'swam', 'swum', 'teach', 'taught', 'taught', 'run', 'ran', 'run', 'buy', 'bought', 'bought', 'do', 'did', 'done', 'come', 'came', 'come', 'fall', 'fell', 'fallen', 'choose', 'chose', 'chosen', 'break', 'broke', 'broken', 'build', 'built', 'built'];
  private _formOfVerbs = [
    ['swim', 'swam', 'swum'], ['teach', 'taught', 'taught'], ['run', 'ran', 'run'], ['buy', 'bought', 'bought'], ['do', 'did', 'done'], ['come', 'came', 'come'], ['fall', 'fell', 'fallen'], ['choose', 'chose', 'chosen'], ['break', 'broke', 'broken'], ['build', 'built', 'built']
  ];
  checkResult: boolean[] = [];
  time: number = 0;
  private timer$: Observable<number> = timer(1000, 1000);
  private _subs!: Subscription;

  ngOnInit() {
    this.mixVerbs();
    this.timerFunc();
  }

  ngAfterViewInit() {
    fromEvent(this.drag.nativeElement, 'dragstart').subscribe((ev:any) => {
      this.dragged = ev.target;
      ev.target.style.opacity = .5;
      this.checkResult = [];
    })

    fromEvent(this.drag.nativeElement, 'dragend').subscribe((ev:any) => {
      ev.target.style.opacity = '';
    })

    fromEvent(this.drag.nativeElement, 'dragover').subscribe((ev:any) => {
        // prevent default to allow drop
      ev.preventDefault();
    })

    fromEvent(this.drag.nativeElement, 'dragenter').subscribe((ev:any) => {
      // highlight potential drop target when the draggable element enters it
      if (ev.target.className == "dropzone") {
        ev.target.style.background = "#52788f";
      }
    })

    fromEvent(this.drag.nativeElement, 'dragleave').subscribe((ev:any) => {
      // reset background of potential drop target when the draggable element leaves it
      if (ev.target.className == "dropzone") {
        ev.target.style.background = "";
      }
    })

    fromEvent(this.drag.nativeElement, 'drop').subscribe((ev:any) => {
      // prevent default action (open as link for some elements)
      ev.preventDefault();
      // move dragged elem to the selected drop target
      if (ev.target.className == "dropzone") {
        ev.target.style.background = "";
        this.dragged.parentNode.replaceChild( ev.target.childNodes[0], this.dragged );
        ev.target.appendChild( this.dragged );
      }
    })
  }

  private timerFunc() {
    this._subs = this.timer$.pipe(
      take(121),
     ).subscribe(
       val => this.time = val,
       err => console.log(err),
       () =>  this.onCheckIrVerbs()
     );
  }

  private mixVerbs() {
    this.verbs.sort( () => .5 - Math.random() );
  }

  onCheckIrVerbs(): void{
    let draggedVerbs = document.querySelectorAll('.draggable');
    this.checkResult = [];
    this._subs.unsubscribe();
    for(let i = 0; i < draggedVerbs.length; i += 3) {
      for(let j = 0; j < this._formOfVerbs.length; j++) {
        if(draggedVerbs[i].innerHTML.trim() === this._formOfVerbs[j][0] &&
          draggedVerbs[i + 1].innerHTML.trim() === this._formOfVerbs[j][1] &&
          draggedVerbs[i + 2].innerHTML.trim() === this._formOfVerbs[j][2]) {
       
          this.checkResult[i] = true;
          this.checkResult[i+1] = true;
          this.checkResult[i+2] = true;
        } 
      } 
    }
  }

  onResetIrVerbs(): void {
    this.mixVerbs();
    this.checkResult = [];
    this._subs.unsubscribe();
    this.timerFunc();
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
