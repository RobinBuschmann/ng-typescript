///<reference path="../typings/tsd.d.ts"/>
///<reference path="../dist/at-angular.d.ts"/>


namespace at.test {

    export const CLASS_NAME = '_Human';

    @at.ClassFactory(MODULE_NAME, CLASS_NAME)
    @at.Inject('serviceA')
    export class Human {

        $$serviceA: ServiceA;

        constructor(private name: string, private age: number) {

        }

        getName() {

            return this.name;
        }

        setName(name: string) {

            this.name = name;
        }

        getAge() {

            return this.age;
        }

        setAge(age: number) {

            this.age = age;
        }
    }
}
