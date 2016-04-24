

module at {


  export interface IInputOptions {
    name?: string;
    isOptional?: boolean;
  }

  /**
   * Prepares input attribute for component directives.
   *
   * @param options
   * @return {function(any, string): void}
   * @annotation
     */
  export function Input(options: IInputOptions = {}): IMemberAnnotationDecorator {

    (<IAttributeOptions>options).binding = '=';
    
    return at.Attribute(options);
  }
}
