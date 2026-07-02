import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ButtonAPICall from '../ButtonAPICall';
import axios from 'axios';

jest.mock('axios');

describe('ButtonAPICall Component', () => {
  test('fetches data from API on button click', async () => {
    const mockResponse = { data: [{ id: 1, title: 'Test Todo' }] };
    axios.get.mockResolvedValue(mockResponse);

    const { getByText } = render(<ButtonAPICall />);
    fireEvent.click(getByText(/fetch todos/i));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos');
    });
  });
});