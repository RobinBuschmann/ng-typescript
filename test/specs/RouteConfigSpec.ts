import IonViewA = at.test.IonViewA;
describe('@RouteConfig', () => {

    const expect = chai.expect;

    let appState: any;
    let ionState: any;

    beforeEach(() => angular.mock.module(at.test.MODULE_NAME));

    beforeEach(angular.mock.inject(($state: ng.ui.IStateService) => {

        appState = $state.get(at.test.APP_STATE_NAME);
        ionState = $state.get(at.test.ION_STATE_NAME);
    }));

    it('should be defined', () => {

        expect(at.RouteConfig).to.be.instanceOf(Function);
    });

    it(`should have ${at.test.APP_STATE_NAME}, that is not null`, () => {

        expect(appState).not.to.be.null;
    });

    it(`should have ${at.test.APP_STATE_NAME}, with correct router configuration` , () => {

        const shouldTemplate = '<component some-attribute="someAttribute" another-attribute="anotherAttribute" ></component>';

        expect(appState.url).to.equal(at.test.APP_STATE_URL);
        expect(appState.views).to.be.an('object');
        expect(appState.views.main).to.be.an('object');
        expect(appState.views.main.component).to.be.a('function');
        expect(appState.views.main.resolve).to.be.an('object');
        expect(appState.views.main.resolve.someAttribute).to.be.a('function');
        expect(appState.views.main.resolve.anotherAttribute).to.be.a('function');
        expect(appState.views.main.controller.length).to.be.equal(4);
        expect(appState.views.main.template).to.be.equal(shouldTemplate);

        expect(appState.component).to.be.a('function');
        expect(appState.resolve).to.be.an('object');
        expect(appState.resolve.someAttribute).to.be.a('function');
        expect(appState.resolve.anotherAttribute).to.be.a('function');
        expect(appState.controller.length).to.be.equal(4);
        expect(appState.template).to.be.equal(shouldTemplate);
    });

    it(`should have ${at.test.ION_STATE_NAME}, with correct router configuration` , () => {

        expect(ionState.url).to.equal(at.test.ION_STATE_URL);
        expect(ionState.views).to.be.an('object');
        expect(ionState.views.main).to.be.an('object');
        expect(ionState.views.main.ionView).to.be.a('function');
        expect(ionState.views.main.controller).to.equal(IonViewA);
        expect(ionState.views.main.template).to.be.equal(at.test.ION_VIEW_A_TEMPLATE);

        expect(ionState.ionView).to.be.a('function');
        expect(ionState.controller).to.equal(IonViewA);
        expect(ionState.template).to.be.equal(at.test.ION_VIEW_A_TEMPLATE);
    });

});
