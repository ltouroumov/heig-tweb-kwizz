import {Directive, ElementRef, Renderer, HostListener, Input, OnInit} from '@angular/core';

@Directive({
    selector: '[autosize]'
})
export class AutosizeDirective implements OnInit {

    @Input()
    private defaultHeight: string = '30px';

    constructor(private el: ElementRef,
                private renderer: Renderer) {
    }

    public ngOnInit(): void {
        this.updateHeight();
    }

    private updateHeight() {
        let $el = this.el.nativeElement;
        let height = ($el.scrollHeight || this.defaultHeight);

        this.renderer.setElementStyle(this.el.nativeElement, 'height', `${height}px`);
    }

    @HostListener("input")
    public onInput() {
        this.updateHeight();
    }

    @HostListener("change")
    public onChange() {
        this.updateHeight();
    }

}