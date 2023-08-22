import React, {useState, useContext} from 'react';
import { ResisdentsContext } from '../App';

function Error() {
	const resisdentsContext = useContext(ResisdentsContext);
	const error = resisdentsContext.error;

	return (
		<div data-testid="errorMsg" className="alert error mt-20 slide-up-fade-in">
			{
				error['kind'] != '' && (
					error['kind'] == 'name' 
						? `Sorry, ${error['name']} is not a verified student!`
						: `Sorry, ${error['name']}'s validity has Expired!`
				)
			}
		</div>
	);
}

export default Error;


import React, {useState, useContext} from 'react';
import { ResisdentsContext } from '../App';

function ResidentsList() {
	const resisdentsContext = useContext(ResisdentsContext);
	const resisdents = resisdentsContext.resisdents;

	return (
		<div className="pa-10 mt-10 w-75">
			<div className="font-weight-bold text-center">Residents List</div>
			<ul className="mt-10 styled w-50 mx-auto" data-testid="residentsNameList">
				{
					resisdents.map((resisdent, index) => (
						<li key={index} className="slide-up-fade-in">
								{resisdent['name']}
						</li>
					))
				}
			</ul>
		</div>
	);
}

export default ResidentsList;


import React, {useState, useContext} from 'react';
import { ResisdentsContext } from '../App';
import { STUDENTS } from '../studentsList';
// `joiningDate` && `validityDate` format "yyyy-mm-dd"

function checkValidity(joiningDate, validityDate) {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const [year, month, day] = joiningDate.split('-');
	const [yyyy, mm, dd] = validityDate.split('-');
	const maxValid = new Date(yyyy, mm - 1, dd);
	const selected = new Date(year, month - 1, day);
	return (maxValid >= selected) && (maxValid >= today);
}

function Search() {
	const resisdentsContext = useContext(ResisdentsContext);
	const [formData, setFormData] = useState({
		name: '',
		joinDate: ''
	});

	const onchange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	}

	const onclick = (e) => {
		const index = STUDENTS.findIndex(student => 
			student.name.toLowerCase() == formData['name'].toLocaleLowerCase()
			);

		if (index == -1) {
			resisdentsContext.setError({
				kind: 'name',
				name: formData['name']
			});
			setFormData({
				name: '',
				joinDate: ''
			});
			return;
		}

		if (!checkValidity(formData['joinDate'], STUDENTS[index].validityDate)) {
			resisdentsContext.setError({
				kind: 'date',
				name: formData['name']
			});
			setFormData({
				name: '',
				joinDate: ''
			});
			return;
		}

		resisdentsContext.setResisdents([
			...resisdentsContext.resisdents,
			formData
		])
		setFormData({
			name: '',
			joinDate: ''
		});
	}

	return (
		<div className="my-50 layout-row align-items-end justify-content-end">
			<label htmlFor="studentName">Student Name:
				<div>
					<input 
						id="studentName" 
						data-testid="studentName" 
						type="text" 
						name="name"
						className="mr-30 mt-10"
						onChange={onchange}
						value={formData['name']}
						/>
				</div>
			</label>
			<label htmlFor="joiningDate">Joining Date:
				<div>
					<input 
						id="joiningDate" 
						data-testid="joiningDate" 
						type="date"
						name="joinDate" 
						className="mr-30 mt-10"
						onChange={onchange}
						value={formData['joinDate']}
						/>
				</div>
			</label>
			<button 
				type="button" 
				data-testid="addBtn" 
				className="small mb-0"
				onClick={onclick}
				>
					Add
				</button>
		</div>
	);
}

export default Search;

import React, {useState, createContext, useContext} from 'react';
import './App.css';
import ResidentsList from './Components/ResidentsList';
import Search from './Components/Search';
import Error from './Components/Error';
import 'h8k-components';

export const ResisdentsContext = createContext(null);

const title = "Hacker Dormitory";
function App() {
  const [resisdents, setResisdents] = useState([]);
  const [error, setError] = useState({
    kind: '',
    name: ''
  });

  return (
    <ResisdentsContext.Provider
      value={{
        resisdents,
        setResisdents,
        error,
        setError
      }}
    >
      <div className="App">
          <h8k-navbar header={title}></h8k-navbar>
        <div className="layout-column justify-content-center align-items-center w-50 mx-auto">
          <Search />
          <Error/>
          <ResidentsList/>
        </div>
      </div>
    </ResisdentsContext.Provider>
  );
}

export default App;


import React from 'react';
import { render, fireEvent, cleanup, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

const TEST_IDS = {
  nameInputId: 'studentName',
  joiningDateId: 'joiningDate',
  addBtnId: 'addBtn',
  errorMsgId: 'errorMsg',
  residentsNameList: 'residentsNameList'
};

describe('Hacker Dormitory', () => {

  let getByTestId;
  let txtInput;
  let dateInput;
  let addButton;
  let list;

  beforeEach(() => {
    const app = render(<App />);
    getByTestId = app.getByTestId;
    txtInput = getByTestId(TEST_IDS.nameInputId);
    dateInput = getByTestId(TEST_IDS.joiningDateId);
    addButton = getByTestId(TEST_IDS.addBtnId);
    list = getByTestId(TEST_IDS.residentsNameList);
  });

  afterEach(() => {
    cleanup();
  });

  it('should add valid students in Residents list', () => {
    fireEvent.change(txtInput, { target: { value: 'Adam' } });
    fireEvent.change(dateInput, { target: { value: '2020-10-10' } });
    fireEvent.click(addButton, { button: '0' });
    expect(list.children[0].textContent.toLowerCase()).toEqual('adam');

    fireEvent.change(txtInput, { target: { value: 'Dhilip' } });
    fireEvent.change(dateInput, { target: { value: '2020-10-10' } });
    fireEvent.click(addButton, { button: '0' });

    expect(list.children[0].textContent.toLowerCase()).toEqual('adam');
    expect(list.children[1].textContent.toLowerCase()).toEqual('dhilip');
  });

  it('should add valid students without case sensitivity', () => {
    fireEvent.change(txtInput, { target: { value: 'aDaM' } });
    fireEvent.change(dateInput, { target: { value: '2020-10-10' } });
    fireEvent.click(addButton, { button: '0' });
    expect(list.children[0].textContent.toLowerCase()).toEqual('adam');
  });

  it('should clear the input fields after adding a new student', () => {
    fireEvent.change(txtInput, { target: { value: 'Adam' } });
    fireEvent.change(dateInput, { target: { value: '2020-10-10' } });
    fireEvent.click(addButton, { button: '0' });
    expect(txtInput.value).toEqual('');
    expect(dateInput.value).toEqual('');
  });

  it('should show error on trying to add a student who is not in the list', () => {
    fireEvent.change(txtInput, { target: { value: 'Anderson' } });
    fireEvent.change(dateInput, { target: { value: '2020-10-10' } });
    fireEvent.click(addButton, { button: '0' });
    let error = getByTestId(TEST_IDS.errorMsgId);
    expect(error.textContent).toEqual('Sorry, Anderson is not a verified student!');

    fireEvent.change(txtInput, { target: { value: 'dam' } });
    fireEvent.change(dateInput, { target: { value: '2019-10-10' } });
    fireEvent.click(addButton, { button: '0' });
    error = getByTestId(TEST_IDS.errorMsgId);
    expect(error.textContent).toEqual(`Sorry, dam is not a verified student!`);
  });

  it('should show error on trying to add a student whose validity has expired', () => {
    fireEvent.change(txtInput, { target: { value: 'Bonnie' } });
    fireEvent.change(dateInput, { target: { value: '2019-10-10' } });
    fireEvent.click(addButton, { button: '0' });
    const error = getByTestId(TEST_IDS.errorMsgId);
    expect(error.textContent).toEqual(`Sorry, Bonnie's validity has Expired!`);
  });

  it('should hold the correct list and error message after series of Students addition', () => {
    fireEvent.change(txtInput, { target: { value: 'Adam' } });
    fireEvent.change(dateInput, { target: { value: '2020-10-10' } });
    fireEvent.click(addButton, { button: '0' });


    fireEvent.change(txtInput, { target: { value: 'Dhilip' } });
    fireEvent.change(dateInput, { target: { value: '2020-10-10' } });
    fireEvent.click(addButton, { button: '0' });

    fireEvent.change(txtInput, { target: { value: 'Talisk' } });
    fireEvent.change(dateInput, { target: { value: '2023-12-11' } });
    fireEvent.click(addButton, { button: '0' });

    let error = getByTestId(TEST_IDS.errorMsgId);
    expect(error.textContent).toEqual(`Sorry, Talisk's validity has Expired!`);

    fireEvent.change(txtInput, { target: { value: 'Talisk' } });
    fireEvent.change(dateInput, { target: { value: '2023-10-10' } });
    fireEvent.click(addButton, { button: '0' });

    fireEvent.change(txtInput, { target: { value: 'Rock' } });
    fireEvent.change(dateInput, { target: { value: '2030-10-10' } });
    fireEvent.click(addButton, { button: '0' });

    error = getByTestId(TEST_IDS.errorMsgId);
    expect(error.textContent).toEqual(`Sorry, Rock is not a verified student!`);

    expect(list.children[0].textContent.toLowerCase()).toEqual('adam');
    expect(list.children[1].textContent.toLowerCase()).toEqual('dhilip');
    expect(list.children[2].textContent.toLowerCase()).toEqual('talisk');
  });
});

