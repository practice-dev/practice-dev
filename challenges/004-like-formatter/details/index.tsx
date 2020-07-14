import {
  Section,
  IsolatedHtml,
  InjectingSection,
  Highlight,
  SubSection,
  HandlesTable,
} from '@pvd/ui';
import { inputData } from './assets/input-data';
import styled from 'styled-components';
import React from 'react';
import exampleCss from './assets/example.css';
import exampleHTML from './assets/example.html';
import { InputTestCase } from './assets/create-input-data';

const Output = styled.div`
  text-align: center;
  background: #eee;
  padding: 5px 0;
  width: 350px;
  margin: 0 auto;
`;

function Example(props: { example: InputTestCase; result: string }) {
  const { example, result } = props;
  return (
    <div>
      Example Input:
      <Highlight code={JSON.stringify(example, null, 2)} lang="js" />
      Example Output:
      <Output>{result}</Output>
    </div>
  );
}

export function Details() {
  return (
    <div>
      <Section title="Overview">
        FriendsPlusPlus is a new social network platform. Users can post content
        and like it. Your task is to create a single component that will be
        responsible only for text formatting.
      </Section>
      <Section title="Use Cases">
        <ul>
          <li>As a user, I can see the user-friendly text of a liked post.</li>
        </ul>
      </Section>
      <Section title="Acceptance Criteria">
        <SubSection title="Sample data">
          Hard-code the following JSON data in your application, and use it as
          an input.
          <Highlight
            maxHeight={200}
            code={JSON.stringify(inputData, null, 2)}
            lang="js"
          />
        </SubSection>
        <SubSection title="Main UI">
          <IsolatedHtml
            height={200}
            addToggle
            css={exampleCss}
            html={exampleHTML}
          />
          <HandlesTable
            entries={[
              {
                handle: 'input-id',
                type: 'form field',
                desc: (
                  <>
                    Represents an ID field. It should include an{' '}
                    <code>input</code> element. <br /> You can assume the input
                    text will be a non-empty string and a valid number. No need
                    to handle error cases.
                  </>
                ),
              },
              {
                handle: 'format-btn',
                type: 'button',
                desc: <>Formats the like text using the provided ID.</>,
              },
              {
                handle: 'result',
                type: 'text',
                desc: <>Displays the formatted text.</>,
              },
            ]}
          />
        </SubSection>
        <SubSection title="Formatting rules">
          <ol>
            <li>
              <strong>No likes</strong>
              <br />
              Display "No likes" if <code>totalLikes</code> is <code>0</code>.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: false,
                  likedFriends: [],
                  totalLikes: 0,
                }}
                result="No likes"
              />
            </li>
            <li>
              <strong>You like it</strong>
              <br />
              Display "You like it" if <code>isLikedByMe</code> is{' '}
              <code>true</code>, <code>likedFriends</code> is an empty array,
              and <code>totalLikes</code> is <code>1</code>.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: true,
                  likedFriends: [],
                  totalLikes: 1,
                }}
                result="You like it"
              />
            </li>
            <li>
              <strong>You like it and another person likes it</strong>
              <br />
              Display "You and 1 another person like it" if{' '}
              <code>isLikedByMe</code> is <code>true</code>,{' '}
              <code>likedFriends</code> is an empty array, and{' '}
              <code>totalLikes</code> is equal to <code>2</code>.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: true,
                  likedFriends: [],
                  totalLikes: 2,
                }}
                result="You and 1 another person like it"
              />
            </li>
            <li>
              <strong>You like it and other people like it</strong>
              <br />
              Display "You and {'<n>'} other people like" if{' '}
              <code>isLikedByMe</code> is <code>true</code>,{' '}
              <code>likedFriends</code> is an empty array, and{' '}
              <code>totalLikes</code> is greater than <code>2</code>.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: true,
                  likedFriends: [],
                  totalLikes: 11,
                }}
                result="You and 10 other people like it"
              />
            </li>
            <li>
              <strong>You like it and your friends like it</strong>
              <br />
              Display "You, {'<friend_name_1>'} and {'<friend_name_2>'} like it"
              if <code>isLikedByMe</code> is <code>true</code>,{' '}
              <code>likedFriends</code> is a non-empty array, and{' '}
              <code>totalLikes</code> is equal to length of{' '}
              <code>likedFriends</code> plus <code>1</code>.
              <br />
              Separate friends names by <code>,</code>, except the last name.
              Use <code>and</code> instead.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: true,
                  likedFriends: ['Tod', 'Otes', 'Merill', 'Vera'],
                  totalLikes: 5,
                }}
                result="You, Tod, Otes and Merill like it"
              />
              <Example
                example={{
                  id: 1,
                  isLikedByMe: true,
                  likedFriends: ['Tod'],
                  totalLikes: 2,
                }}
                result="You and Tod like it"
              />
            </li>
            <li>
              <strong>
                You like it, your friends like it and another person likes it
              </strong>
              <br />
              Display "You, {'<friend_name_1>'}, {'<friend_name_2>'} and 1
              another person like it" if <code>isLikedByMe</code> is{' '}
              <code>true</code>, <code>likedFriends</code> is a non-empty array,
              and
              <code>totalLikes</code> is equal to length of{' '}
              <code>likedFriends</code> plus <code>2</code>.
              <br />
              Separate friends names by <code>,</code>.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: true,
                  likedFriends: ['Tod', 'Otes', 'Merill'],
                  totalLikes: 5,
                }}
                result="You, Tod, Otes, Merill and 1 another person like it"
              />
            </li>
            <li>
              <strong>
                You like it, your friends like it and other people like it
              </strong>
              <br />
              Display "You, {'<friend_name_1>'}, {'<friend_name_2>'} and {'<n>'}{' '}
              other people like" if <code>isLikedByMe</code> is{' '}
              <code>true</code>, <code>likedFriends</code> is a non-empty array,
              and
              <code>totalLikes</code> is greater than
              <code>likedFriends</code> plus <code>2</code>.
              <br />
              Separate friends names by <code>,</code>.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: true,
                  likedFriends: ['Tod', 'Otes', 'Merill'],
                  totalLikes: 10,
                }}
                result="You, Tod, Otes, Merill and 6 other people like it"
              />
            </li>
            <li>
              <strong>Your friend likes it</strong>
              <br />
              Display "{'<friend_name>'} likes it" if <code>isLikedByMe</code>{' '}
              is <code>false</code>, <code>likedFriends</code> has a single
              element, and
              <code>totalLikes</code> is <code>1</code>.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: false,
                  likedFriends: ['Tod'],
                  totalLikes: 1,
                }}
                result="Tod likes it"
              />
            </li>
            <li>
              <strong>Your friends like it</strong>
              <br />
              Display "{'<friend_name_1>'}, {'<friend_name_2>'} and{' '}
              {'<friend_name_3>'} like it" if <code>isLikedByMe</code> is{' '}
              <code>false</code>, <code>likedFriends</code> is a non-empty
              array, and
              <code>totalLikes</code> is equal to length of{' '}
              <code>likedFriends</code>.
              <br />
              Separate friends names by <code>,</code>, except the last name.
              Use <code>and</code> instead.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: false,
                  likedFriends: ['Tod', 'Otes', 'Merill'],
                  totalLikes: 3,
                }}
                result="Tod, Otes and Merill like it"
              />
            </li>
            <li>
              <strong>Your friends like it and another person likes it</strong>
              <br />
              Display "{'<friend_name_1>'}, {'<friend_name_2>'} and 1 another
              person like it" if <code>isLikedByMe</code> is <code>false</code>,{' '}
              <code>likedFriends</code> is a non-empty array, and
              <code>totalLikes</code> is equal to length of{' '}
              <code>likedFriends</code> plus <code>1</code>.
              <br />
              Separate friends names by <code>,</code>.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: false,
                  likedFriends: ['Tod', 'Otes', 'Merill'],
                  totalLikes: 4,
                }}
                result="Tod, Otes, Merill and 1 another person like it"
              />
            </li>
            <li>
              <strong>Your friends like it and other people like it</strong>
              <br />
              Display "{'<friend_name_1>'}, {'<friend_name_2>'} and {'<n>'}{' '}
              other people like" if <code>isLikedByMe</code> is{' '}
              <code>false</code>, <code>likedFriends</code> is a non-empty
              array, and
              <code>totalLikes</code> is greater than
              <code>likedFriends</code> plus <code>1</code>.
              <br />
              Separate friends names by <code>,</code>.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: false,
                  likedFriends: ['Tod', 'Otes', 'Merill'],
                  totalLikes: 10,
                }}
                result="Tod, Otes, Merill and 7 other people like it"
              />
            </li>
            <li>
              <strong>Only another person likes it</strong>
              <br />
              Display "1 person likes it" if <code>isLikedByMe</code> is{' '}
              <code>false</code>, <code>likedFriends</code> is an empty array,
              and
              <code>totalLikes</code> is equal to <code>1</code>.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: false,
                  likedFriends: [],
                  totalLikes: 1,
                }}
                result="1 person likes it"
              />
            </li>
            <li>
              <strong>Only other people like it</strong>
              <br />
              Display "{'<n>'} people like it" if <code>isLikedByMe</code> is{' '}
              <code>false</code>, <code>likedFriends</code> is an empty array,
              and
              <code>totalLikes</code> is greater than <code>1</code>.
              <Example
                example={{
                  id: 1,
                  isLikedByMe: false,
                  likedFriends: [],
                  totalLikes: 5,
                }}
                result="5 people like it"
              />
            </li>
          </ol>
        </SubSection>
      </Section>
      <Section title="Demo">
        <video
          style={{ width: '100%', height: 340, outline: 'none' }}
          src={
            'https://practice.dev/assets/004-demo.253574241a352f5ef28541d48e959ef0.mp4'
          }
          loop
          controls
        ></video>
      </Section>
      <InjectingSection />
    </div>
  );
}
