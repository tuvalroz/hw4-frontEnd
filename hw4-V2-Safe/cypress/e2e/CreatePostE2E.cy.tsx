
describe('CreatePostE2E.cy.tsx', () => {
    it('Creating a new draft', () => {
        cy.visit('http://localhost:3000/')
        cy.contains('Sign up').click()
        cy.wait(500);

        const number = Math.random() * 10000;
        const username = `E2eTestUsername${number}`;
        cy.get('.action-Username').type(username)
        cy.get('.action-Password').type(`E2eTestPass${number}`)
        cy.get('.action-Email').type(`E2eTestEmail${number}`)
        cy.get('.action-RegisterButton').click()
        cy.wait(500);

        cy.get('.action-NewPostButton').click()
        cy.wait(500);

        cy.url().should('include', '/create')

        cy.get('.action-Title').type("e2e Title")
        cy.get('.action-Content').type("e2e content")
        cy.get('.action-CreateButton').click()
    })
})