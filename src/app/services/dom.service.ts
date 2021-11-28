import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, ComponentRef } from "@angular/core";

/**
 * @description Service responsible for creating and removing dynamically created components from the #modal-container
 *
 * @export
 * @class DomService
 */
@Injectable({
  providedIn: "root"
})
export class DomService {

  /**
   * @description Modal component, upon creation, is stored in the this.childComponentRef variable.
   * You can think of this variable as the current-active-modal-component in your application.
   * @private
   * @type {*}
   * @member childComponentRef
   * @memberof DomService
   */
  private childComponentRef: any;

  /**
   * @description Creates an instance of DomService.
   * @param {ComponentFactoryResolver} componentFactoryResolver A simple registry that maps Components to generated ComponentFactory classes
   * that can be used to create instances of components dynamically. Use to obtain the factory for a given component type,
   * then use the factory's create() method to create a component of that type.
   * @param {ApplicationRef} appRef A reference to an Angular application running on a page.
   * @param {Injector} injector Concrete injectors implement this interface.
   * Injectors are configured with providers that associate dependencies of various types with injection tokens.
   * @memberof DomService
   */
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  /**
   * @description
   *
   * @param {string} parentId This will be #modal-container since the parent of the component will be our modal container.
   * @param {*} child This is the component itself
   * @param {IChildConfig} [childConfig] This is an object containing the inputs and outputs that will be passed to the child component.
   * @memberof DomService
   */
  public appendComponentTo(parentId: string, child: any, childConfig?: IChildConfig): void {
    // Create a component reference from the component
    const childComponentRef: ComponentRef<unknown> = this.componentFactoryResolver
      .resolveComponentFactory(child)
      .create(this.injector);

    // Attach the config to the child (inputs and outputs)
    this.attachConfig(childConfig, childComponentRef);

    this.childComponentRef = childComponentRef;
    // Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(childComponentRef.hostView);

    // Get DOM element from component
    const childDomElem: HTMLElement = (childComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    // Append DOM element to the body
    document.getElementById(parentId).appendChild(childDomElem); // appends the component into the #parentId div.

  }

  /**
   * @description Destroys the current-active-modal-component.
   * It also removes it from the component tree so that angular knows not to check it when change detection occurs.
   * @member removeComponent
   * @memberof DomService
   */
  public removeComponent(): void {
    this.appRef.detachView(this.childComponentRef.hostView);
    this.childComponentRef.destroy();
  }


  /**
   * @description Attach the config to the child component reference (inputs and outputs)
   * @private
   * @param {IChildConfig} config
   * @param {ComponentRef<unknown>} componentRef
   * @member attachConfig
   * @memberof DomService
   */
  private attachConfig(config: IChildConfig, componentRef: ComponentRef<unknown>): void {
    const inputs: any = config.inputs;
    const outputs: any = config.outputs;
    for (const key in inputs) {
      componentRef.instance[key] = inputs[key];
    }
    for(const key in outputs){
      componentRef.instance[key] = outputs[key];
    }
    
  }
}
interface IChildConfig {
  inputs: object;
  outputs: object;
}
