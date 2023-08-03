import { AddIcon, DeleteIcon, Search2Icon } from "@chakra-ui/icons";
import { Box, Button, CircularProgress, IconButton, Input, ListItem, OrderedList, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";

const endpoint = {
    SEARCH: "/search",
    ADD: "/add",
    DELETE: "/"
}

const api = "/api"
const toastConfig = {
    duration: 4000,
    isClosable: true,
    position: 'bottom-right',
};

function Search (props) {
    const [value, setValue] = useState('')
    const [invalid, setInvalid] = useState(false)
    const [listWord, setListWord] = useState([])
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleChange = (event) => setValue(event.target.value)

    const handleInvalid = () => {
        if (value.trim() === "") {
            setInvalid(true);
            toast({
                title: "Input is required!",
                status: 'error',
                ...toastConfig
            })
            return false
        }
        setInvalid(false)
        return true
    }

    const handleSubmitSearch = (e) => {
        e.preventDefault()
        if (!handleInvalid()) return

        setLoading(true)
        fetch(`${api}${endpoint.SEARCH}?searchText=${value}`, {
            method: 'GET'
        }).then(data => data.json())
        .then(data => {
            if (data.metadata && data.metadata.length) {
                setListWord(data.metadata)
                setLoading(false)
            } else if (data.status === "error") {
                setLoading(false)
                toast({
                    title: data.message || "Something went wrong!",
                    status: 'error',
                    ...toastConfig
                })
            }
        }).catch(error => {
            setLoading(false)
        })
    }

    const handleSubmitAdd = () => {
        if (!handleInvalid()) return
        setLoading(true)
        setListWord([])
        fetch(`${api}${endpoint.ADD}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word_content: value })
        },{

        }).then(data => data.json())
        .then(data => {
            console.log("==data==", data)
            if (data.metadata) {
                setLoading(false)
                toast({
                    title: data.message || "Add word success!",
                    status: 'success',
                    ...toastConfig
                })
            } else if (data.status === "error") {
                setLoading(false)
                toast({
                    title: data.message || "Something went wrong!",
                    status: 'error',
                    ...toastConfig
                })
            }
        }).catch(error => {
            setLoading(false)
            toast({
                title: "Something went wrong!",
                status: 'error',
                ...toastConfig
            })
        })
    }

    const handleSubmitDelete = () => {
        if (!handleInvalid()) return
        setLoading(true)
        setListWord([])
        fetch(`${api}${endpoint.DELETE}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word_content: value })
        }).then(data => data.json())
        .then(data => {
            console.log("==data==", data)
            if (data.metadata) {
                setLoading(false)
                toast({
                    title: data.message || "Delete word success!",
                    status: 'success',
                    ...toastConfig
                })
            } else if (data.status === "error") {
                setLoading(false)
                toast({
                    title: data.message || "Something went wrong!",
                    status: 'error',
                    ...toastConfig
                })
            }
        }).catch(error => {
            setLoading(false)
            toast({
                title: error.message || "Something went wrong!",
                status: 'error',
                ...toastConfig
            })
        })
    }

    return (
        <Box w={"100%"}>
            <form onSubmit={handleSubmitSearch}>
                <Box w={"100%"} marginTop={"10"} textAlign={"center"}>
                    <Text
                        bgGradient='linear(to-l, #78C5DC, #97DEE7)'
                        bgClip='text'
                        fontSize={{ base: "4xl", md: "8xl" }}
                        fontWeight='extrabold'
                    >
                        Search-engine
                    </Text>
                </Box>
                <Box w={"100%"} padding={"10"} maxWidth={"700"} margin={"0 auto"}>
                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <Input
                            value={value}
                            size={'lg'}
                            placeholder="Enter your word"
                            onChange={handleChange}
                            maxWidth={"600px"}
                            isInvalid={invalid}
                            errorBorderColor='red.300'
                        />
                        <IconButton
                            height={"-moz-max-content"}
                            colorScheme={"twitter"}
                            width={"auto"}
                            ml={2}
                            p={4}
                            icon={<Search2Icon />}
                            onClick={handleSubmitSearch}
                            type="submit"
                        />
                        <IconButton
                            height={"-moz-max-content"}
                            colorScheme={"blue"}
                            width={"auto"}
                            ml={1}
                            p={4}
                            icon={<AddIcon />}
                            onClick={handleSubmitAdd}
                        />
                        <IconButton
                            height={"-moz-max-content"}
                            colorScheme={"red"}
                            width={"auto"}
                            ml={1}
                            p={4}
                            icon={<DeleteIcon />}
                            onClick={handleSubmitDelete}
                        />
                    </Box>
                    <Box padding={"5"}>
                        {!loading ? 
                            <OrderedList fontSize={"18px"}>
                                {listWord.map((val, key) => <ListItem key={key} mb={"5px"}>{val}</ListItem>)}
                            </OrderedList>
                                :
                            <CircularProgress />
                        }
                    </Box>
                </Box>
            </form>
        </Box>
    )
}

export default Search;