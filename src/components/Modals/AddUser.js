import React, { useContext, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import TextTooltip from '../Tooltip'

import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_USERS } from '../../gql/query'
import { CREATE_UNIQUE_LINK } from '../../gql/mutation'

const AddUserModal = ({ show, onClose, onConfirm }) => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('Email field cannot be empty')
    const { data: users, loading: usersLoading, error: usersError } = useQuery(
        GET_ALL_USERS,
    )

    const [addUser] = useMutation(CREATE_UNIQUE_LINK, {
        variables: {
            email,
        },
    })

    const onChange = e => {
        setEmail(e.target.value)
        const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (
            !emailRe.test(
                String(e.target.value)
                    .trim()
                    .toLowerCase(),
            )
        ) {
            setError('Invalid email address')
        } else if (
            Object.values(users.users).some(
                user => user.email === e.target.value,
            )
        ) {
            // check if user exists in users object
            setError(
                'A user with that email has already been added to the system!',
            )
        } else {
            setError('')
        }
    }

    if (usersLoading) {
        return <div>Loading...</div>
    }

    if (usersError) {
        return <div>Error! {usersError.message} </div>
    }

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>Add User</Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Email </Form.Label>
                        <Form.Control
                            value={email}
                            onChange={onChange}
                        ></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                {error.length !== 0 ? (
                    <TextTooltip text={error}>
                        <span>
                            <Button
                                variant="success disabled"
                                onClick={e => {
                                    e.preventDefault()
                                }}
                            >
                                Add User
                            </Button>
                        </span>
                    </TextTooltip>
                ) : (
                    <Button
                        variant="success"
                        onClick={() => {
                            addUser()
                            onConfirm()
                        }}
                    >
                        Add User
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    )
}

export default AddUserModal
