import { render, screen, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw";
import UserList from "../UserList";
import { server } from "../../../mocks/server";
import { mockData } from "../../../utils/mock-data/mock-data";

beforeAll(() => {
    // Start the interception.
    server.listen()
})

afterEach(() => {
    // Remove any handlers you may have added
    // in individual tests (runtime handlers).
    server.resetHandlers()
})

afterAll(() => {
    // Disable request interception and clean up.
    server.close();
})

describe('Users component', () => {

    it('Users Component data Loading...', async () => {
        render(<UserList />);
        const loadingText = screen.getByRole('heading', { name: "Loading..." });
        expect(loadingText).toBeInTheDocument();
        const heading = await screen.findByText("Users");
        expect(heading).toBeInTheDocument();
    })

    it('users fetched successfully', async () => {
        render(<UserList />);
        const heading = await screen.findByText('Leanne Graham');
        expect(heading).toBeInTheDocument();
    })

    it('users api error', async () => {
        render(<UserList />);
        server.use(
            http.get('https://jsonplaceholder.typicode.com/users', () => {
                return new HttpResponse(null, { status: 401 })
            })
        )
        const heading = await screen.queryByText('Leanne Graham');
        expect(heading).not.toBeInTheDocument();
    })

    it('renders error', async () => {
        render(<UserList />);
        server.use(
            http.get('https://jsonplaceholder.typicode.com/users', () => {
                return new HttpResponse(null, { status: 500 })
            })
        )
        waitFor(() => {
            const error = screen.queryByText('Something went wrong!');
            expect(error).toBeInTheDocument()
        });
    })

    it('Users List rendering', async () => {
        render(<UserList />);
        const lists = await screen.findAllByRole('listitem');
        expect(lists).toHaveLength(mockData.length);
    })
})