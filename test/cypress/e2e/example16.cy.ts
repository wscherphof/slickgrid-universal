describe('Example 16 - Regular & Custom Tooltips', () => {
  const titles = [
    '',
    'Title',
    'Duration',
    'Description',
    'Description 2',
    'Cost (in €)',
    '% Complete',
    'Start',
    'Finish',
    'Effort Driven',
    'Prerequisites',
    'Action',
  ];
  const GRID_ROW_HEIGHT = 33;

  it('should display Example title', () => {
    cy.visit(`${Cypress.config('baseUrl')}/example16`);
    cy.get('h3').should('contain', 'Example 16 - Regular & Custom Tooltips');
    cy.get('h3 span.subtitle').should('contain', '(with Salesforce Theme)');
  });

  it('should have exact column titles on 1st grid', () => {
    cy.get('.grid16')
      .find('.slick-header-columns')
      .children()
      .each(($child, index) => expect($child.text()).to.eq(titles[index]));
  });

  it('should change server delay to 10ms for faster testing', () => {
    cy.get('[data-test="server-delay"]').clear().type('50');
  });

  it('should mouse over 1st row checkbox column and NOT expect any tooltip to show since it is disabled on that column', () => {
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"] > .slick-cell:nth(0)`).as('checkbox0-cell');
    cy.get('@checkbox0-cell').trigger('mouseover');

    cy.get('.slick-custom-tooltip').should('not.exist');
    cy.get('@checkbox0-cell').trigger('mouseout');
  });

  it('should mouse over Task 2 cell and expect async tooltip to show', () => {
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"] > .slick-cell:nth(1)`).as('task1-cell');
    cy.get('@task1-cell').should('contain', 'Task 2');
    cy.get('@task1-cell').trigger('mouseover');
    cy.get('.slick-custom-tooltip').contains('loading...');

    cy.wait(10);
    cy.get('.slick-custom-tooltip').should('be.visible');
    cy.get('.slick-custom-tooltip').contains('Task 2 - (async tooltip)');

    cy.get('.tooltip-2cols-row:nth(0)').find('div:nth(0)').contains('Completion:');
    cy.get('.tooltip-2cols-row:nth(0)').find('div').should('have.class', 'percent-complete-bar-with-text');

    cy.get('.tooltip-2cols-row:nth(1)').find('div:nth(0)').contains('Lifespan:');
    cy.get('.tooltip-2cols-row:nth(1)').find('div:nth(1)').contains(/\d+$/); // use regexp to make sure it's a number

    cy.get('.tooltip-2cols-row:nth(2)').find('div:nth(0)').contains('Ratio:');
    cy.get('.tooltip-2cols-row:nth(2)').find('div:nth(1)').contains(/\d+$/); // use regexp to make sure it's a number

    cy.get('@task1-cell').trigger('mouseout');
  });

  it('should mouse over Task 6 cell and expect async tooltip to show', () => {
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"] > .slick-cell:nth(1)`).as('task6-cell');
    cy.get('@task6-cell').should('contain', 'Task 6');
    cy.get('@task6-cell').trigger('mouseover');
    cy.get('.slick-custom-tooltip').contains('loading...');

    cy.wait(10);
    cy.get('.slick-custom-tooltip').should('be.visible');
    cy.get('.slick-custom-tooltip').contains('Task 6 - (async tooltip)');

    cy.get('.tooltip-2cols-row:nth(1)').find('div:nth(0)').contains('Lifespan:');
    cy.get('.tooltip-2cols-row:nth(1)').find('div:nth(1)').contains(/\d+$/); // use regexp to make sure it's a number

    cy.get('.tooltip-2cols-row:nth(2)').find('div:nth(0)').contains('Ratio:');
    cy.get('.tooltip-2cols-row:nth(2)').find('div:nth(1)').contains(/\d+$/); // use regexp to make sure it's a number

    cy.get('@task6-cell').trigger('mouseout');
  });

  it('should mouse over Task 6 cell on "Start" column and expect a delayed tooltip opening via async process', () => {
    cy.get('.slick-custom-tooltip').should('not.exist');
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"] > .slick-cell:nth(7)`).as('start6-cell');
    cy.get('@start6-cell').contains(/\d{4}-\d{2}-\d{2}$/); // use regexp to make sure it's a number
    cy.get('@start6-cell').trigger('mouseover');

    cy.wait(10);
    cy.get('.slick-custom-tooltip').should('be.visible');
    cy.get('.slick-custom-tooltip').contains('Custom Tooltip');

    cy.get('.tooltip-2cols-row:nth(0)').find('div:nth(0)').contains('Id:');
    cy.get('.tooltip-2cols-row:nth(0)').find('div:nth(1)').contains('6');

    cy.get('.tooltip-2cols-row:nth(1)').find('div:nth(0)').contains('Title:');
    cy.get('.tooltip-2cols-row:nth(1)').find('div:nth(1)').contains('Task 6');

    cy.get('.tooltip-2cols-row:nth(2)').find('div:nth(0)').contains('Effort Driven:');
    cy.get('.tooltip-2cols-row:nth(2)').find('div:nth(1)').should('be.empty');

    cy.get('.tooltip-2cols-row:nth(3)').find('div:nth(0)').contains('Completion:');
    cy.get('.tooltip-2cols-row:nth(3)').find('div:nth(1)').find('.mdi-check-circle-outline').should('exist');

    cy.get('@start6-cell').trigger('mouseout');
  });

  it('should mouse over 6th row Description and expect full cell content to show in a tooltip because cell has ellipsis and is too long for the cell itself', () => {
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"] > .slick-cell:nth(3)`).as('desc6-cell');
    cy.get('@desc6-cell').should('contain', 'This is a sample task description.');
    cy.get('@desc6-cell').trigger('mouseover');

    cy.get('.slick-custom-tooltip').should('be.visible');
    cy.get('.slick-custom-tooltip').should(
      'not.contain',
      `regular tooltip (from title attribute)\nTask 6 cell value:\n\nThis is a sample task description.\nIt can be multiline\n\nAnother line...`
    );
    cy.get('.slick-custom-tooltip').should('contain', `This is a sample task description.\nIt can be multiline\n\nAnother line...`);

    cy.get('@desc6-cell').trigger('mouseout');
  });

  it('should mouse over 6th row Description 2 and expect regular tooltip title + concatenated full cell content when using "useRegularTooltipFromFormatterOnly: true"', () => {
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"] > .slick-cell:nth(4)`).as('desc2-5-cell');
    cy.get('@desc2-5-cell').should('contain', 'This is a sample task description.');
    cy.get('@desc2-5-cell').trigger('mouseover');

    cy.get('.slick-custom-tooltip').should('be.visible');
    cy.get('.slick-custom-tooltip').should(
      'contain',
      `regular tooltip (from title attribute)\nTask 6 cell value:\n\nThis is a sample task description.\nIt can be multiline\n\nAnother line...`
    );

    cy.get('@desc2-5-cell').trigger('mouseout');
  });

  it('should mouse over 2nd row Duration and expect a custom tooltip shown with 4 label/value pairs displayed', () => {
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"] > .slick-cell:nth(2)`).as('duration2-cell');
    cy.get('@duration2-cell').contains(/\d+\sday[s]?$/);
    cy.get('@duration2-cell').trigger('mouseover');

    cy.get('.slick-custom-tooltip').should('be.visible');
    cy.get('.slick-custom-tooltip').contains('Custom Tooltip');

    cy.get('.tooltip-2cols-row:nth(0)').find('div:nth(0)').contains('Id:');
    cy.get('.tooltip-2cols-row:nth(0)').find('div:nth(1)').contains('6');

    cy.get('.tooltip-2cols-row:nth(1)').find('div:nth(0)').contains('Title:');
    cy.get('.tooltip-2cols-row:nth(1)').find('div:nth(1)').contains('Task 6');

    cy.get('.tooltip-2cols-row:nth(2)').find('div:nth(0)').contains('Effort Driven:');
    cy.get('.tooltip-2cols-row:nth(2)').find('div:nth(1)').should('be.empty');

    cy.get('.tooltip-2cols-row:nth(3)').find('div:nth(0)').contains('Completion:');
    cy.get('.tooltip-2cols-row:nth(3)').find('div:nth(1)').find('.mdi-check-circle-outline').should('exist');

    cy.get('@duration2-cell').trigger('mouseout');
  });

  it('should mouse over % Complete cell of Task 6 and expect regular tooltip to show with content "x %" where x is a number', () => {
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"] > .slick-cell:nth(6)`).as('percentage-cell');
    cy.get('@percentage-cell').find('.percent-complete-bar').should('exist');
    cy.get('@percentage-cell').trigger('mouseover');

    cy.get('.slick-custom-tooltip').should('be.visible');
    cy.get('.slick-custom-tooltip').contains(/\d+%$/);

    cy.get('@percentage-cell').trigger('mouseout');
  });

  it('should mouse over Prerequisite cell of Task 6 and expect regular tooltip to show with content "Task 6, Task 5"', () => {
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"] > .slick-cell:nth(10)`).as('prereq-cell');
    cy.get('@prereq-cell').should('contain', 'Task 6, Task 5');
    cy.get('@prereq-cell').trigger('mouseover');

    cy.get('.slick-custom-tooltip').should('be.visible');
    cy.get('.slick-custom-tooltip').should('contain', 'Task 6, Task 5');

    cy.get('@prereq-cell').trigger('mouseout');
  });

  it('should mouse over header-row (filter) 1st column checkbox and NOT expect any tooltip to show since it is disabled on that column', () => {
    cy.get(`.slick-headerrow-columns .slick-headerrow-column:nth(0)`).as('checkbox0-filter');
    cy.get('@checkbox0-filter').trigger('mouseover');

    cy.get('.slick-custom-tooltip').should('not.exist');
    cy.get('@checkbox0-filter').trigger('mouseout');
  });

  it('should mouse over header-row (filter) 2nd column Title and expect a tooltip to show rendered from an headerRowFormatter', () => {
    cy.get(`.slick-headerrow-columns .slick-headerrow-column:nth(1)`).as('checkbox0-filter');
    cy.get('@checkbox0-filter').trigger('mouseover');

    cy.get('.slick-custom-tooltip').should('be.visible');
    cy.get('.slick-custom-tooltip').contains('Custom Tooltip - Header Row (filter)');

    cy.get('.tooltip-2cols-row:nth(0)').find('div:nth(0)').contains('Column:');
    cy.get('.tooltip-2cols-row:nth(0)').find('div:nth(1)').contains('title');

    cy.get('@checkbox0-filter').trigger('mouseout');
  });

  it('should mouse over header-row (filter) Finish column and NOT expect any tooltip to show since it is disabled on that column', () => {
    cy.get(`.slick-headerrow-columns .slick-headerrow-column:nth(8)`).as('finish-filter');
    cy.get('@finish-filter').trigger('mouseover');

    cy.get('.slick-custom-tooltip').should('not.exist');
    cy.get('@finish-filter').trigger('mouseout');
  });

  it('should open PreRequisite dropdown and expect it be lazily loaded', () => {
    cy.get('.slick-headerrow-columns .slick-headerrow-column:nth(10)').as('checkbox10-header');
    cy.get('@checkbox10-header').click();
    cy.get('[data-test="alert-lazy"]').should('be.visible');
    cy.get('[data-name="filter-prerequisites"] .ms-loading span').contains('Loading...');
    cy.wait(50);
    cy.get('@checkbox10-header').click();
    cy.get('[data-test="alert-lazy"]').should('not.be.visible');
    cy.get('[data-name="filter-prerequisites"] .ms-loading').should('not.exist');
  });

  it('should mouse over header-row (filter) Prerequisite column and expect to see tooltip of selected filter options', () => {
    cy.get('.slick-headerrow-columns .slick-headerrow-column:nth(10)').as('checkbox10-header');
    cy.get('@checkbox10-header').trigger('mouseover');

    cy.get('.filter-prerequisites .ms-choice span').contains('15 of 1000 selected');
    cy.get('.slick-custom-tooltip').should('be.visible');
    cy.get('.slick-custom-tooltip').contains(
      'Task 1, Task 3, Task 5, Task 7, Task 9, Task 12, Task 15, Task 18, Task 21, Task 25, Task 28, Task 29, Task 30, Task 32, Task 34'
    );

    cy.get('@checkbox10-header').trigger('mouseout');
  });

  it('should mouse over header title on 1st column with checkbox and NOT expect any tooltip to show since it is disabled on that column', () => {
    cy.get('.slick-header-columns .slick-header-column:nth(0)').as('checkbox-header');
    cy.get('@checkbox-header').trigger('mouseover');

    cy.get('.slick-custom-tooltip').should('not.exist');
    cy.get('@checkbox-header').trigger('mouseout');
  });

  it('should mouse over header title on 2nd column with Title name and expect a tooltip to show rendered from an headerFormatter', () => {
    cy.get('.slick-header-columns .slick-header-column:nth(1)').as('checkbox0-header');
    cy.get('@checkbox0-header').trigger('mouseover');

    cy.get('.slick-custom-tooltip').should('be.visible');
    cy.get('.slick-custom-tooltip').contains('Custom Tooltip - Header');

    cy.get('.tooltip-2cols-row:nth(0)').find('div:nth(0)').contains('Column:');
    cy.get('.tooltip-2cols-row:nth(0)').find('div:nth(1)').contains('Title');

    cy.get('@checkbox0-header').trigger('mouseout');
  });

  it('should mouse over header title on 2nd column with Finish name and NOT expect any tooltip to show since it is disabled on that column', () => {
    cy.get('.slick-header-columns .slick-header-column:nth(8)').as('finish-header');
    cy.get('@finish-header').trigger('mouseover');

    cy.get('.slick-custom-tooltip').should('not.exist');
    cy.get('@finish-header').trigger('mouseout');
  });

  it('should click Prerequisite editor of 1st row (Task 2) and expect Task1 & 2 to be selected in the multiple-select drop', () => {
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"] > .slick-cell:nth(10)`).as('prereq-cell');
    cy.get('@prereq-cell').should('contain', 'Task 2, Task 1').click();

    cy.get('div.ms-drop[data-name=editor-prerequisites]').find('li.selected').should('have.length', 2);

    cy.get('div.ms-drop[data-name=editor-prerequisites]').find('li.selected:nth(0) span').should('contain', 'Task 1');

    cy.get('div.ms-drop[data-name=editor-prerequisites]').find('li.selected:nth(1) span').should('contain', 'Task 2');

    cy.get('div.ms-drop[data-name=editor-prerequisites]').find('.ms-ok-button').click();

    cy.get('div.ms-drop[data-name=editor-prerequisites]').should('not.exist');
  });

  it('should change filters dynamically with just "=" filter and expect rows with empty descriptions', () => {
    cy.get('[data-test="filter-empty-desc"]').click();

    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"] > .slick-cell:nth(4) span`).should('be.empty');
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 1}px);"] > .slick-cell:nth(4) span`).should('be.empty');
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"] > .slick-cell:nth(4) span`).should('be.empty');
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 3}px);"] > .slick-cell:nth(4) span`).should('be.empty');
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 4}px);"] > .slick-cell:nth(4) span`).should('be.empty');
  });

  it('should change filters dynamically with just "!=" filter and expect rows with non-empty descriptions', () => {
    cy.get('[data-test="filter-non-empty-desc"]').click();

    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 0}px);"] > .slick-cell:nth(4) span`).should('not.be.empty');
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 1}px);"] > .slick-cell:nth(4) span`).should('not.be.empty');
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 2}px);"] > .slick-cell:nth(4) span`).should('not.be.empty');
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 3}px);"] > .slick-cell:nth(4) span`).should('not.be.empty');
    cy.get(`[style="transform: translateY(${GRID_ROW_HEIGHT * 4}px);"] > .slick-cell:nth(4) span`).should('not.be.empty');
  });
});
