
describe('LoginE2E.cy.tsx', () => {
  it('Visits the login page', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Log in').click()
    cy.wait(500);

    cy.url().should('include', '/login')
  })
})