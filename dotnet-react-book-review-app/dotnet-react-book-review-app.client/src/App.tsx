import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomeIndex from "./components/Home/HomeIndex";

// Author components
import AuthorList from "./components/Authors/AuthorList";
import AuthorForm from "./components/Authors/AuthorForm";
import AuthorDetail from "./components/Authors/AuthorDetail";

// Category components
import CategoryList from "./components/Categories/CategoryList";
import CategoryForm from "./components/Categories/CategoryForm";
import CategoryDetail from "./components/Categories/CategoryDetail";

// Book components
import BookList from "./components/Books/BookList";
import BookForm from "./components/Books/BookForm";
import BookDetail from "./components/Books/BookDetail";

// Review components
import ReviewList from "./components/Reviews/ReviewList";
import ReviewForm from "./components/Reviews/ReviewForm";
import ReviewDetail from "./components/Reviews/ReviewDetail";

// Authentication components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Logout from "./components/Auth/Logout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

const App: React.FC = () => (
    <Router>
        <Layout>
            <Switch>
                {/* Home Route */}
                <Route exact path="/" component={HomeIndex}/>

                {/* Authentication Routes */}
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>
                <Route exact path="/logout" component={Logout}/>

                {/* Author Routes */}
                <Route exact path="/authors" component={AuthorList}/>
                <ProtectedRoute exact path="/authors/create" component={AuthorForm}/>
                <ProtectedRoute exact path="/authors/edit/:id" component={AuthorForm}/>
                <Route exact path="/authors/:id" component={AuthorDetail}/>

                {/* Category Routes */}
                <Route exact path="/categories" component={CategoryList}/>
                <ProtectedRoute exact path="/categories/create" component={CategoryForm}/>
                <ProtectedRoute exact path="/categories/edit/:id" component={CategoryForm}/>
                <Route exact path="/categories/:id" component={CategoryDetail}/>

                {/* Book Routes */}
                <Route exact path="/books" component={BookList}/>
                <ProtectedRoute exact path="/books/create" component={BookForm}/>
                <ProtectedRoute exact path="/books/edit/:id" component={BookForm}/>
                <Route exact path="/books/:id" component={BookDetail}/>

                {/* Review Routes */}
                <Route exact path="/reviews" component={ReviewList}/>
                <ProtectedRoute exact path="/reviews/create" component={ReviewForm}/>
                <ProtectedRoute exact path="/reviews/edit/:id" component={ReviewForm}/>
                <Route exact path="/reviews/:id" component={ReviewDetail}/>
            </Switch>
        </Layout>
    </Router>
);

export default App;