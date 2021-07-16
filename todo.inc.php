<?php

/**
 * Main class to hanle To Do application
 */
 class todo {

    private $jsonfile = 'todos.json';
    private $jsoncats = 'todocat.json';

    /**
     * Construct the class 
     * @return string json of todos
     */
    public function __construct() {
        
        //sanitize the input
        $todo = $this->sanitize((isset($_REQUEST['todo'])) ? $_REQUEST['todo'] : "list");

        //get all the to dos
        $todolist = json_decode(file_get_contents($this->jsonfile), true);

        // if the API is called to perform an action:
        if(isset($todo)) {

            switch ($todo) {
                // List categories
                case 'todocats':
                    $output = json_decode(file_get_contents($this->jsoncats), true);
                    break;

                // Add a task
                case 'addtodo':
                    
                    //Validate and assign data
                    $element = $this->validateInput(array(
                        "id" => $this->sanitize($_REQUEST['id']),
                        "todoText" => $this->sanitize($_REQUEST['todoText']),
                        "todoDate" => $this->sanitize($_REQUEST['todoDate'])
                        )
                    );

                    // Validate the input strings
                    if($element) {
                        $output = $todolist;
                        $output[] = $element;
                        file_put_contents($this->jsonfile, json_encode($output));
                    } 
                    //TODO: create method to return error

                    break;

                // delete a task
                case 'deletetodo':
                    $output = array();
                    $id = $this->sanitize($_REQUEST['id']);
                    foreach($todolist as $element) { 
                        if($id != $element["id"]){ 
                           $output[] = $element; 
                        }
                    }

                    //write to file
                    file_put_contents($this->jsonfile, json_encode($output));
                    break;
                
                // List To Dos
                default:
                case 'list':
                    //output list of todos
                    $output = $todolist;
                    break;
            }

        }

        // print out the result as JSON
       echo json_encode($output);

    }

    /**
     * Sanitize input values for better security
     * @param string $string
     * @return string or false 
     */
    private function sanitize($string) {
        //if the string is empty return false
        if (! isset($string) || $string=='' )
            return false;

        //sanitize the string
        $result = strip_tags($string);
        $result = filter_var ( $result, FILTER_SANITIZE_STRING);

        return $result;
    }

    /** Validate user input data 
     * @param array $key => $value
     * @return array mixed or false
    */
    protected function validateInput($data) {
        //if the input is not an array 
        if(!is_array($data) && count($data)<1)
            return false;
        
        //validate the input data
        foreach($data as $key => $value) {
            if(($value = $this->sanitize($value)) == false)
                return false;
            //TODO: return error

            $output[$key] = $value;
        }

        return $output;
        
    }

 }