
describe('PublishPostE2E.cy.tsx', () => {
    it('Publishing a new post', () => {
        cy.visit('http://localhost:3000/')
        cy.contains('Sign up').click();
        const number = Math.random() * 10000;
        const username = `E2eTestUsername${number}`;
        cy.wait(500);
        cy.get('.action-Username').type(username)
        cy.get('.action-Password').type(`E2eTestPass${number}`)
        cy.get('.action-Email').type(`E2eTestEmail${number}`)
        cy.get('.action-RegisterButton').click()
        cy.wait(500);

        cy.get('.action-NewPostButton').click()
        cy.wait(500);

        cy.url().should('include', '/create')

        const title = `e2e Title${number}`;
        cy.get('.action-Title').type(title)
        cy.get('.action-Content').type("e2e content")
        cy.get('.action-CreateButton').click()
        cy.wait(500);

        cy.get('.post').click()
        cy.wait(500);

        cy.get('.action-PublishButton').click()
        cy.wait(500);

        cy.contains(title)
    })
})