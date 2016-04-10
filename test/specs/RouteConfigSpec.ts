
import ViewA = at.test.ViewA;
describe('@RouteConfig', () => {

    const expect = chai.expect;

    let appState: any;
    let viewState: any;

    beforeEach(() => angular.mock.module(at.test.MODULE_NAME));

    beforeEach(angular.mock.inject(($state: ng.ui.IStateService) => {

        appState = $state.get(at.test.APP_STATE_NAME);
        viewState = $state.get(at.test.VIEW_STATE_NAME);
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

    it(`should have ${at.test.VIEW_STATE_NAME}, with correct router configuration` , () => {

        expect(viewState.url).to.equal(at.test.VIEW_STATE_URL);
        expect(viewState.views).to.be.an('object');
        expect(viewState.views.main).to.be.an('object');
        expect(viewState.views.main.view).to.be.a('function');
        expect(viewState.views.main.controller).to.equal(ViewA);
        expect(viewState.views.main.template).to.be.equal(at.test.VIEW_VIEW_A_TEMPLATE);

        expect(viewState.view).to.be.a('function');
        expect(viewState.controller).to.equal(ViewA);
        expect(viewState.template).to.be.equal(at.test.VIEW_VIEW_A_TEMPLATE);
    });

});
