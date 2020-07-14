import {
  FormFields,
  SubSection,
  IsolatedHtml,
  HandlesTable,
  AdditionalReq,
} from '@pvd/ui';
import addProjectHtml from './assets/addProject.html';
import editProjectHtml from './assets/editProject.html';
import stylesCss from './assets/styles.css';
import React from 'react';

interface ProjectFormSectionProps {
  edit?: boolean;
}

export function ProjectFormSection(props: ProjectFormSectionProps) {
  const { edit } = props;

  return (
    <SubSection title={edit ? 'Edit Project page' : 'Add Project page'}>
      <IsolatedHtml
        height={500}
        addToggle
        css={stylesCss}
        html={edit ? editProjectHtml : addProjectHtml}
      />
      <HandlesTable
        entries={[
          {
            handle: 'breadcrumb',
            type: 'container',
            desc: (
              <>
                Contains breadcrumb items (<code>bc-i</code>).
              </>
            ),
          },
          {
            handle: 'bc-1',
            type: 'link',
            desc: <>Redirects to the Home page.</>,
          },
          {
            handle: 'bc-2',
            type: 'link',
            desc: <>Redirects to the Projects page.</>,
          },
          {
            handle: 'bc-3',
            type: 'text',
            desc: (
              <>Displays static {edit ? 'Edit Project' : 'Add Project'} text.</>
            ),
          },
          {
            handle: 'name',
            type: 'form field',
            desc: (
              <>
                Represents a name field. It should include an <code>input</code>{' '}
                element and an <code>error</code> handle for the validation
                message.
              </>
            ),
          },
          {
            handle: 'owner',
            type: 'form field',
            desc: (
              <>
                Represents an owner field. It should include a{' '}
                <code>select</code> element and an <code>error</code> handle for
                the validation message.
              </>
            ),
          },
          {
            handle: 'del-member-btn-i',
            type: 'button',
            desc: <>Deletes the member from the list.</>,
          },
          {
            handle: 'member-i',
            type: 'text',
            desc: <>Displays the username of the i-th member in the list.</>,
          },
          {
            handle: 'add-member',
            type: 'form field',
            desc: (
              <>
                Represents an add member field. It should include a{' '}
                <code>select</code> element and an <code>error</code> handle for
                the validation message.
              </>
            ),
          },
          {
            handle: 'add-member-btn',
            type: 'button',
            desc: (
              <>
                Validates and adds a selected member to the member list. <br />
                It should only validate the <code>add-member</code> field.{' '}
                <br />
                After adding a member, clear the select value in{' '}
                <code>add-member</code>.
              </>
            ),
          },
          {
            handle: 'save-btn',
            type: 'button',
            desc: (
              <>
                Validates and saves the projects. If the project was
                successfully {edit ? 'edited' : 'created'}, redirect to the
                Projects page.
              </>
            ),
          },
        ]}
      />
      <FormFields
        entries={[
          {
            field: 'name',
            type: 'text',
            desc: 'Represents the project name.',
            defaultValue: edit
              ? 'The name of the edited project.'
              : 'An empty value.',
            rules: [
              {
                rule: 'Required',
                error: 'Name is required',
                condition: 'The input is empty.',
              },
            ],
          },
          {
            field: 'owner',
            type: 'select',
            desc: (
              <>
                Represents the project owner.
                <br />
                Admin users can select any user. <br />
                Owner users can't edit this field. When an owner user creates a
                project, he is set automatically as an owner.
                <br /> Disable this field for the owner users. Add a{' '}
                <code>disabled</code> attribute to the <code>select</code>{' '}
                element.
              </>
            ),
            options: (
              <>
                Show all users with the owner role.
                <br />
                Sort them alphabetically by username. <br />
                The option text should be the username.
              </>
            ),
            defaultValue: edit ? (
              'The owner of the edited project.'
            ) : (
              <>
                For admin users, the select should be not selected by default.{' '}
                <br />
                For owner users, the select should be selected to himself by
                default.
              </>
            ),
            rules: [
              {
                rule: 'Required',
                error: 'Owner is required',
                condition: 'The owner is not selected.',
              },
            ],
          },
          {
            field: 'add-member',
            type: 'select',
            desc: <>Represents a select for adding a new member.</>,
            options: (
              <>
                Show all users with the reporter role. <br />
                Sort them alphabetically by username. <br />
                The option text should be the username. <br />
                Don't display users that are already added as members, so that
                it won't be possible to add the same user twice.
              </>
            ),
            defaultValue: 'The select should be not selected by default.',
            rules: [
              {
                rule: 'Required',
                error: 'Member is required',
                condition: 'The member is not selected.',
              },
            ],
          },
        ]}
      />
      {edit ? (
        <>Represents a form page for editing a project.</>
      ) : (
        <>Represents a form page for creating a new project.</>
      )}{' '}
      This page is only accessible to admin and owner users. Reporters are not
      allowed to create projects.
      <AdditionalReq
        items={[
          <>Don't show validation messages by default.</>,
          <>It's possible to create a project with no members.</>,
          <>
            Trigger synchronous validation errors immediately when typing a
            value to inputs.
          </>,
          <>
            It should be a separate route. Refreshing the page should load this
            page again.
          </>,
          <>
            The <code>i</code> symbol in handles represents the row number in
            the list (starting from 1).
          </>,
          <>Loading states and confirmation alerts are not required.</>,
        ]}
      />
    </SubSection>
  );
}
