import {
  Section,
  IsolatedHtml,
  InjectingSection,
  SubSection,
  HandlesTable,
  AdditionalReq,
} from '@pvd/ui';
import stylesCss from './assets/styles.css';
import homeHtml from './assets/home.html';
import projectsHtml from './assets/projects.html';
import deleteProjectHtml from './assets/deleteProject.html';
import React from 'react';
import { ProjectFormSection } from './ProjectFormSection';

export function Details() {
  return (
    <div>
      <Section title="Overview">
        Buggi tracker is a new generation tool for bug tracking and project
        management. <br />
        In this iteration, you must implement project management pages.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As an admin user, I can create, edit, or delete any project.</li>
          <li>
            As an owner user, I can view and edit projects that I am assigned
            to.
          </li>
          <li>As an owner user, I can create a new project.</li>
          <li>
            As a reporter user, I can view projects that I am assigned to.
          </li>
        </ul>
      </Section>
      <Section title="Features">
        <SubSection title="Seed data">
          Use the same seed data from the previous iteration.
          <br />
          There should be no projects by default.
        </SubSection>
        <SubSection title="Home page">
          <IsolatedHtml
            height={220}
            addToggle
            css={stylesCss}
            html={homeHtml}
          />
          <HandlesTable
            entries={[
              {
                handle: 'home-card-users',
                type: 'link',
                desc: (
                  <>
                    Redirects to the Users page. Visible only for users with the
                    admin role.
                  </>
                ),
              },
              {
                handle: 'home-card-projects',
                type: 'link',
                desc: <>Redirects to the Projects page.</>,
              },
            ]}
          />
          Represents a home page for all users.
        </SubSection>
        <SubSection title="Users page">
          Users page and Add/Edit User pages should remain the same.
          <br />
          You can assume that a user won't be deleted or edited if associated
          with a project (added as an owner or as a member).
        </SubSection>
        <SubSection title="Projects page">
          <IsolatedHtml
            height={330}
            addToggle
            css={stylesCss}
            html={projectsHtml}
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
                type: 'text',
                desc: <>Displays static "Projects" text.</>,
              },
              {
                handle: 'add-project-btn',
                type: 'link',
                desc: (
                  <>
                    Redirects to the New Project page. <br />
                    Only admin and owner role can create a project. Hide this
                    button for reporter users.
                  </>
                ),
              },
              {
                handle: 'name-i',
                type: 'text',
                desc: <>Displays the name of the i-th project in the table.</>,
              },
              {
                handle: 'owner-i',
                type: 'text',
                desc: (
                  <>
                    Displays the owner username of the i-th project in the
                    table.
                  </>
                ),
              },
              {
                handle: 'delete-btn-i',
                type: 'button',
                desc: (
                  <>
                    Shows a delete confirmation modal. <br />
                    Only admin users can delete a project. Hide this button for
                    other roles.
                  </>
                ),
              },
              {
                handle: 'edit-btn-i',
                type: 'link',
                desc: (
                  <>
                    Redirects to the Edit Project page. <br />
                    Only admin and owner role can edit a project. Hide this
                    button for reporter users.
                  </>
                ),
              },
            ]}
          />
          Represents a projects page. All users can access this page.
          <AdditionalReq
            items={[
              <>
                Display a list of all projects sorted alphabetically by name.
              </>,
              <>
                Don't implement pagination. You can assume there will be less
                than 20 projects during testing.
              </>,
              <>
                It should be a separate route. Refreshing the page should load
                this page again.
              </>,
              <>
                The <code>i</code> symbol in handles represents the row number
                in the table (starting from 1).
              </>,
            ]}
          />
        </SubSection>
        <SubSection title="Projects page (delete project)">
          <IsolatedHtml
            height={330}
            addToggle
            css={stylesCss}
            html={deleteProjectHtml}
          />
          <HandlesTable
            entries={[
              {
                handle: 'modal',
                type: 'container',
                desc: <>Represents the modal dialog.</>,
              },
              {
                handle: 'desc',
                type: 'text',
                desc: (
                  <>
                    Displays the warning message. <br />
                    If you delete the <code>blog</code> project, display: <br />
                    <code>Are you sure to delete "blog"?</code>
                  </>
                ),
              },
              {
                handle: 'no-btn',
                type: 'button',
                desc: <>Hides the modal dialog.</>,
              },
              {
                handle: 'yes-btn',
                type: 'button',
                desc: <>Deletes the project, and removes it from the table.</>,
              },
            ]}
          />
          <AdditionalReq
            items={[
              <>Loading states and confirmation alerts are not required.</>,
            ]}
          />
        </SubSection>
        <ProjectFormSection />
        <ProjectFormSection edit />
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 340, outline: 'none' }}
          src={
            'https://practice.dev/assets/001-3-demo.f707ee4072e5c8cc1ce077441580c6b1.mp4'
          }
          loop
          controls
        ></video>
      </Section>
      <InjectingSection />
    </div>
  );
}
