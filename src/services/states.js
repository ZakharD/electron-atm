const Trace = nodeRequire('./src/controllers/trace.js');

function StatesService(){
    this.states = {};

    /**
     * [getEntry get the state entry, e.g. state entry 3 is a substring of original state string from position 7 to position10 ]
     * @param  {[type]} data  [state data to parse]
     * @param  {[type]} entry [state entry to get]
     * @return {[type]}       [3-bytes long state entry on success, null otherwise]
     */
    this.getEntry = function(data, entry){
        if(entry > 0 && entry < 2)
            return data.substring(3, 4);
        else if (entry < 10)            
            return data.substring(1 + 3 * (entry - 1), 4 + 3 * (entry - 1));

        return null;
    }


    /**
     * [addState description]
     * @param {[type]} state [description]
     * @return {boolean}     [true if state was successfully added, false otherwise]
     */
    this.addState = function(state){
        var parsed = this.parseState(state);
        if(parsed){
            this.states[parsed.number] = parsed;
            console.log('\tState processed (states overall: ' + Object.keys(this.states).length + '):' + this.trace.object(parsed));
            return true;
        }
        else
            return false;
    };

    /**
     * [parseState description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    this.parseState = function(data){
        var parsed = {};
        parsed.description = '';
        parsed.number = data.substring(0, 3)
        parsed.type = this.getEntry(data, 1);
        
        switch(parsed.type){
            case 'A':
                parsed.description = 'Card read state';
                ['screen_number',           /* State entry 2 */
                'good_read_next_state',     /* State entry 3 */
                'error_screen_number',      /* State entry 4 */
                'read_condition_1',         /* State entry 5 */
                'read_condition_2',         /* State entry 6 */
                'read_condition_3',         /* State entry 7 */
                'card_return_flag',         /* State entry 8 */
                'no_fit_match_next_state',  /* State entry 9 */
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case 'B':
                parsed.description = 'PIN Entry state';
                ['screen_number',
                'timeout_next_state',
                'cancel_next_state',
                'local_pin_check_good_next_state',
                'local_pin_check_max_bad_pins_next_state',
                'local_pin_check_error_screen',
                'remote_pin_check_next_screen',
                'local_pin_check_max_retries',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case 'b':
                parsed.description = 'Customer selectable PIN state';
                ['first_entry_screen_number',
                'timeout_next_state',
                'cancel_next_state',
                'good_read_next_state',
                'csp_fail_next_state',
                'second_entry_screen_number',
                'mismatch_first_entry_screen_number',
                'extension_state',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case 'C':
                parsed.description = 'Envelope Dispenser state';
                ['next_state',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case 'D':
                parsed.description = 'PreSet Operation Code Buffer';
                ['next_state',
                'clear_mask',
                'A_preset_mask',
                'B_preset_mask',
                'C_preset_mask',
                'D_preset_mask',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                parsed.extension_state = this.getEntry(data, 9);
                break;

            case 'E':
                parsed.description = 'Four FDK selection state';
                ['screen_number',
                'timeout_next_state',
                'cancel_next_state',
                'FDK_A_next_state',
                'FDK_B_next_state',
                'FDK_C_next_state',
                'FDK_D_next_state',
                'buffer_location',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case 'F':
                parsed.description = 'Amount entry state';
                ['screen_number',
                'timeout_next_state',
                'cancel_next_state',
                'FDK_A_next_state',
                'FDK_B_next_state',
                'FDK_C_next_state',
                'FDK_D_next_state',
                'amount_display_screen',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case 'G':
                parsed.description = 'Amount check state';
                ['amount_check_condition_true',
                'amount_check_condition_false',
                'buffer_to_check',
                'integer_multiple_value',
                'decimal_places',
                'currency_type',
                'amount_check_condition',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case 'H':
                parsed.description = 'Information Entry State';
                ['screen_number',
                'timeout_next_state',
                'cancel_next_state',
                'FDK_A_next_state',
                'FDK_B_next_state',
                'FDK_C_next_state',
                'FDK_D_next_state',
                'buffer_and_display_params',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case 'I':
                parsed.description = 'Transaction request state';
                ['screen_number',
                'timeout_next_state',
                'send_track2',
                'send_track1_track3',
                'send_operation_code',
                'send_amount_data',
                'send_pin_buffer',
                'send_buffer_B_buffer_C',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case 'J':
                parsed.description = 'Close state';
                ['receipt_delivered_screen',
                'next_state',
                'no_receipt_delivered_screen',
                'card_retained_screen_number',
                'statement_delivered_screen_number',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });

                parsed.bna_notes_returned_screen = this.getEntry(data, 8);
                parsed.extension_state = this.getEntry(data, 9);
                break;

            case 'k':
                parsed.description = 'Smart FIT check state';
                parsed.good_read_next_state = this.getEntry(data, 3);
                parsed.card_return_flag = this.getEntry(data, 8);
                parsed.no_fit_match_next_state = this.getEntry(data, 9);
                break;

            case 'K':
                parsed.description = 'FIT Switch state';
                parsed.states = [];
                var i = 2;
                while(i < 10){
                    parsed.states.push(this.getEntry(data, i));
                    i++;
                }
                break;

            case 'W':
                parsed.description = 'FDK Switch state';
                parsed.states = {};
                ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach( (element, index) => {
                    parsed.states[element] = this.getEntry(data, index + 2)
                });
                break;

            case 'Z':
                parsed.description = 'Extension state'
                parsed.entries = [];
                for(var i = 2; i < 10; i++)
                    parsed.entries.push(this.getEntry(data, i))
                break;

            case 'X':
                parsed.description = 'FDK information entry state';
                ['screen_number', 
                'timeout_next_state', 
                'cancel_next_state', 
                'FDK_next_state', 
                'extension_state', 
                'buffer_id', 
                'FDK_active_mask',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });

                break;

            case 'Y':
                parsed.description = 'Eight FDK selection state';
                ['screen_number',
                'timeout_next_state',
                'cancel_next_state',
                'FDK_next_state',
                'extension_state',
                'buffer_positions',
                'FDK_active_mask',
                'multi_language_screens',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case '>':
                parsed.description = 'Cash deposit state';
                ['cancel_key_mask',
                'deposit_key_mask',
                'add_more_key_mask',
                'refund_key_mask',
                'extension_state_1',
                'extension_state_2',
                'extension_state_3',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case '/':
                parsed.description = 'Complete ICC selection';
                ['please_wait_screen_number',
                'icc_app_name_template_screen_number',
                'icc_app_name_screen_number',
                'extension_state',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case '?':
                parsed.description = 'Set ICC transaction data';
                ['next_state',
                'currency_type',
                'transaction_type',
                'amount_authorized_source',
                'amount_other_source',
                'amount_too_large_next_state',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case 'z':
                parsed.description = 'EMV ICC Application Switch state';
                ['next_state',
                'terminal_aid_extension_1',
                'next_state_extension_1',
                'terminal_aid_extension_2',
                'next_state_extension_2',
                'terminal_aid_extension_3',
                'next_state_extension_3',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case '+':
                parsed.description = 'Begin ICC Initialization state';
                ['icc_init_started_next_state',
                'icc_init_not_started_next_state',
                'icc_init_requirement',
                'automatic_icc_app_selection_flag',
                'default_app_label_usage_flag',
                'cardholder_confirmation_flag',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case ',':
                parsed.description = 'Complete ICC Initialization state';
                ['please_wait_screen_number',
                'icc_init_success',
                'card_not_smart_next_state',
                'no_usable_applications_next_state',
                'icc_app_level_error_next_state',
                'icc_hardware_level_error_next_state',
                'no_usable_applications_fallback_next_state',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case '-':
                parsed.description = 'Automatic Language Selection state';
                ['language_match_next_state',
                'no_language_match_next_state',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case '.':
                parsed.description = 'Begin ICC Application Selection & Initialization state';
                ['cardholder_selection_screen_number',
                'FDK_template_screen_numbers_extension_state',
                'action_keys_extension_state_number',
                'exit_paths_extension_state_number',
                'single_app_cardholder_selection_screen_number',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;

            case ';':
                parsed.description = 'ICC Re-initialize state';
                ['good_read_next_state',
                'processing_not_performed_next_state',
                'reinit_method',
                'chip_power_control',
                'reset_terminal_pobjects',
                ].forEach( (element, index) => {
                    parsed[element] = this.getEntry(data, index + 2)
                });
                break;


            default:
                console.log('StatesService.parseState(): error processing state ' + parsed.number + ': unsupported state type ' + parsed.type);
                return null;
        }

        return parsed;
    }

    this.trace = new Trace();
}

/**
 * [get description]
 * @param  {[type]} state_number [description]
 * @return {[type]}              [description]
 */
StatesService.prototype.get = function(state_number){
    return this.states[state_number];
};

/**
 * [add description]
 * @param {[type]} data [array of data to add]
 * @return {boolean}     [true if data were successfully added, false otherwise]
 */
StatesService.prototype.add = function(data){
    if(typeof data === 'object') {
        for (var i = 0; i < data.length; i++){
            if(!this.addState(data[i])){
                console.log('Error processing state ' + data[i] );
                return false;
            }
        }
        return true;
    } else if (typeof data === 'string') {
        return this.addState(data);
    } 
};

module.exports = StatesService