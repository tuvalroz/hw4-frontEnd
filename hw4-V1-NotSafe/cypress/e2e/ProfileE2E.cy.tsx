
describe('ProfileE2E.cy.tsx', () => {
    it('Getting into the profile page', () => {
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

        cy.get('.action-ProfileButton').click()
        cy.wait(500);

        cy.url().should('include', '/profile')
        cy.contains(`username : ${username}`)

    })
})